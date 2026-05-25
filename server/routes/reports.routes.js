const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// GET /api/reports/sales - Sales by period
router.get('/sales', authenticateToken, authorizeRoles('gerente', 'admin'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = {};
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to + 'T23:59:59');
    }

    const orders = await prisma.order.findMany({ where });

    // Group by month
    const monthly = {};
    orders.forEach(o => {
      const month = o.date.toISOString().substring(0, 7); // YYYY-MM
      if (!monthly[month]) monthly[month] = { month, total: 0, count: 0, compras: 0, alquileres: 0 };
      monthly[month].total += o.price;
      monthly[month].count++;
      if (o.type === 'compra') monthly[month].compras++;
      else monthly[month].alquileres++;
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
    const totalOrders = orders.length;
    const totalCompras = orders.filter(o => o.type === 'compra').length;
    const totalAlquileres = orders.filter(o => o.type === 'alquiler').length;

    res.json({
      summary: { totalRevenue: Math.round(totalRevenue * 100) / 100, totalOrders, totalCompras, totalAlquileres },
      monthly: Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month))
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/reports/sales-by-type - Breakdown by operation type
router.get('/sales-by-type', authenticateToken, authorizeRoles('gerente', 'admin'), async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    const compras = orders.filter(o => o.type === 'compra');
    const alquileres = orders.filter(o => o.type === 'alquiler');

    res.json({
      compras: { count: compras.length, revenue: Math.round(compras.reduce((s, o) => s + o.price, 0) * 100) / 100 },
      alquileres: { count: alquileres.length, revenue: Math.round(alquileres.reduce((s, o) => s + o.price, 0) * 100) / 100 },
      byItemType: {
        movies: orders.filter(o => o.itemType === 'movie').length,
        series: orders.filter(o => o.itemType === 'series').length,
        collections: orders.filter(o => o.itemType === 'collection').length,
      }
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/reports/ranking/popular - Most bought/rented
router.get('/ranking/popular', authenticateToken, authorizeRoles('gerente', 'admin'), async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    const counts = {};
    orders.forEach(o => {
      const key = o.itemId;
      if (!counts[key]) counts[key] = { itemId: o.itemId, title: o.itemTitle, itemType: o.itemType, compras: 0, alquileres: 0, total: 0, revenue: 0 };
      counts[key].total++;
      counts[key].revenue += o.price;
      if (o.type === 'compra') counts[key].compras++;
      else counts[key].alquileres++;
    });

    const ranking = Object.values(counts).sort((a, b) => b.total - a.total).slice(0, 10);
    res.json(ranking);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/reports/ranking/rated - Best and worst rated
router.get('/ranking/rated', authenticateToken, authorizeRoles('gerente', 'admin'), async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      where: { active: true, totalRatings: { gt: 0 } },
      orderBy: { avgRating: 'desc' }
    });
    
    res.json({
      best: movies.slice(0, 10).map(m => ({ id: m.id, title: m.title, avgRating: m.avgRating, totalRatings: m.totalRatings, imageUrl: m.imageUrl })),
      worst: [...movies].reverse().slice(0, 10).map(m => ({ id: m.id, title: m.title, avgRating: m.avgRating, totalRatings: m.totalRatings, imageUrl: m.imageUrl }))
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
