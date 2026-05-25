const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = { active: true };
    if (category) where.categories = { has: category };

    let series = await prisma.series.findMany({ where });

    if (search) {
      const q = search.toLowerCase();
      series = series.filter(s => s.title.toLowerCase().includes(q));
    }

    res.json(series);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const s = await prisma.series.findUnique({ where: { id: req.params.id } });
    if (!s) return res.status(404).json({ error: 'Serie no encontrada' });
    res.json(s);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    if (!req.body.title) return res.status(400).json({ error: 'Título es requerido' });
    const s = await prisma.series.create({
      data: {
        id: generateId(),
        isan: req.body.isan || null,
        title: req.body.title,
        season: req.body.season || null,
        seasons: req.body.seasons || null,
        episodes: req.body.episodes || null,
        year: req.body.year || null,
        originalLanguage: req.body.originalLanguage || null,
        subtitles: req.body.subtitles || [],
        dubbing: req.body.dubbing || [],
        actors: req.body.actors || [],
        directors: req.body.directors || [],
        categories: req.body.categories || [],
        salePrice: req.body.salePrice || 0,
        rentalPrice: req.body.rentalPrice || 0,
        imageUrl: req.body.imageUrl || null,
        description: req.body.description || null,
        rating: req.body.rating || null,
        avgRating: 0,
        totalRatings: 0,
        active: true
      }
    });
    res.status(201).json(s);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.series.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Serie no encontrada' });
    const { id, ...updateData } = req.body;
    const s = await prisma.series.update({ where: { id: req.params.id }, data: updateData });
    res.json(s);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.series.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Serie no encontrada' });
    await prisma.series.update({ where: { id: req.params.id }, data: { active: false } });
    res.json({ message: 'Serie eliminada correctamente' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
