const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

// Languages
router.get('/', async (req, res) => {
  try { res.json(await prisma.language.findMany()); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'Nombre es requerido' });
    const lang = await prisma.language.create({
      data: { id: generateId(), name: req.body.name, code: req.body.code || '' }
    });
    res.status(201).json(lang);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.language.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Idioma no encontrado' });
    const { id, ...updateData } = req.body;
    const lang = await prisma.language.update({ where: { id: req.params.id }, data: updateData });
    res.json(lang);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.language.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Idioma no encontrado' });
    await prisma.language.delete({ where: { id: req.params.id } });
    res.json({ message: 'Idioma eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
