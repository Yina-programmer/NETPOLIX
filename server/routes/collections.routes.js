const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

router.get('/', async (req, res) => {
  try {
    res.json(await prisma.collection.findMany({ where: { active: true } }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const col = await prisma.collection.findUnique({ where: { id: req.params.id } });
    if (!col) return res.status(404).json({ error: 'Colección no encontrada' });

    // Resolve videos
    const videoIds = col.videos || [];
    const movies = videoIds.length > 0 ? await prisma.movie.findMany({ where: { id: { in: videoIds } } }) : [];
    const series = videoIds.length > 0 ? await prisma.series.findMany({ where: { id: { in: videoIds } } }) : [];

    const videos = videoIds.map(vid => {
      return movies.find(m => m.id === vid) || series.find(s => s.id === vid) || { id: vid, title: 'Desconocido' };
    });

    res.json({ ...col, videoDetails: videos });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    if (!req.body.title || !req.body.isan) return res.status(400).json({ error: 'Título e ISAN son requeridos' });
    const col = await prisma.collection.create({
      data: {
        id: generateId(),
        isan: req.body.isan,
        title: req.body.title,
        volume: req.body.volume || 1,
        videos: req.body.videos || [],
        salePrice: req.body.salePrice || 0,
        rentalPrice: req.body.rentalPrice || 0,
        description: req.body.description || null,
        active: true
      }
    });
    res.status(201).json(col);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.collection.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Colección no encontrada' });
    const { id, ...updateData } = req.body;
    const col = await prisma.collection.update({ where: { id: req.params.id }, data: updateData });
    res.json(col);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.collection.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Colección no encontrada' });
    await prisma.collection.update({ where: { id: req.params.id }, data: { active: false } });
    res.json({ message: 'Colección eliminada' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
