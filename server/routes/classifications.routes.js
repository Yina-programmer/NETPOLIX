const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

router.get('/', async (req, res) => {
  try { res.json(await prisma.classification.findMany()); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    if (!req.body.type) return res.status(400).json({ error: 'Tipo es requerido' });
    const c = await prisma.classification.create({
      data: { id: generateId(), type: req.body.type, description: req.body.description || '' }
    });
    res.status(201).json(c);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.classification.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Clasificación no encontrada' });
    const { id, ...updateData } = req.body;
    const c = await prisma.classification.update({ where: { id: req.params.id }, data: updateData });
    res.json(c);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.classification.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Clasificación no encontrada' });
    await prisma.classification.delete({ where: { id: req.params.id } });
    res.json({ message: 'Clasificación eliminada' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
