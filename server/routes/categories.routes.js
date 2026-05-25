const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

router.get('/', async (req, res) => {
  try { res.json(await prisma.category.findMany()); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'Nombre es requerido' });
    const cat = await prisma.category.create({
      data: { id: generateId(), name: req.body.name, description: req.body.description || '' }
    });
    res.status(201).json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Categoría no encontrada' });
    const { id, ...updateData } = req.body;
    const cat = await prisma.category.update({ where: { id: req.params.id }, data: updateData });
    res.json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Categoría no encontrada' });
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: 'Categoría eliminada' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
