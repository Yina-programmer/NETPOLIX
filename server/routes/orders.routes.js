const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

// POST create order (client)
router.post('/', authenticateToken, authorizeRoles('cliente'), async (req, res) => {
  try {
    const { items } = req.body; // [{itemId, itemType, type}] where type is 'compra' or 'alquiler'
    if (!items || !items.length) return res.status(400).json({ error: 'Se requiere al menos un item' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.penalized) {
      return res.status(403).json({ error: 'Tu cuenta está penalizada. No puedes realizar operaciones.' });
    }

    const config = await prisma.config.findUnique({ where: { id: 1 } });
    const pointsRedeemed = parseInt(req.body.pointsToRedeem) || 0;
    const newOrders = [];
    let totalPrice = 0;
    let totalPointsEarned = 0;

    for (const item of items) {
      let found;
      if (item.itemType === 'movie') {
        found = await prisma.movie.findUnique({ where: { id: item.itemId } });
      } else if (item.itemType === 'series') {
        found = await prisma.series.findUnique({ where: { id: item.itemId } });
      } else if (item.itemType === 'collection') {
        found = await prisma.collection.findUnique({ where: { id: item.itemId } });
      } else {
        return res.status(400).json({ error: 'Tipo de item inválido' });
      }

      if (!found) return res.status(404).json({ error: `Item ${item.itemId} no encontrado` });

      const price = item.type === 'alquiler'
        ? (found.rentalPrice || config?.movieRentalPrice || 4.99)
        : (found.salePrice || config?.movieSalePrice || 14.99);
      const points = item.type === 'alquiler'
        ? (config?.pointsPerRental || 10)
        : (config?.pointsPerSale || 25);

      const order = {
        id: generateId(),
        userId: req.user.id,
        type: item.type,
        itemType: item.itemType,
        itemId: item.itemId,
        itemTitle: found.title,
        price,
        pointsEarned: points,
        pointsRedeemed: 0,
        date: new Date()
      };

      newOrders.push(order);
      totalPrice += price;
      totalPointsEarned += points;
    }

    // Calculate new points
    let newPoints;
    if (pointsRedeemed > 0) {
      const userPoints = user.points || 0;
      const maxRedeemable = Math.min(pointsRedeemed, userPoints);
      if (newOrders.length > 0) {
        newOrders[0].pointsRedeemed = maxRedeemable;
      }
      newPoints = (userPoints - maxRedeemable) + totalPointsEarned;
    } else {
      newPoints = (user.points || 0) + totalPointsEarned;
    }

    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      for (const order of newOrders) {
        await tx.order.create({ data: order });
      }
      await tx.user.update({
        where: { id: req.user.id },
        data: { points: newPoints }
      });
    });

    res.status(201).json({
      orders: newOrders,
      totalPrice,
      pointsEarned: totalPointsEarned,
      currentPoints: newPoints
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET all orders (admin/gerente)
router.get('/', authenticateToken, authorizeRoles('admin', 'gerente'), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { date: 'desc' } });
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET my orders (client)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const myOrders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(myOrders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
