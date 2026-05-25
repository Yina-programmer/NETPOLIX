const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

router.get('/', async (req, res) => {
  try {
    const { search, role } = req.query;
    let people = await prisma.person.findMany();
    if (search) { const q = search.toLowerCase(); people = people.filter(p => p.name.toLowerCase().includes(q)); }
    if (role) people = people.filter(p => p.roles?.includes(role));
    res.json(people);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await prisma.person.findUnique({ where: { id: req.params.id } });
    if (!p) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'Nombre es requerido' });
    const person = await prisma.person.create({
      data: { id: generateId(), name: req.body.name, birthDate: req.body.birthDate || null, roles: req.body.roles || [] }
    });
    res.status(201).json(person);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.person.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Persona no encontrada' });
    const { id, ...updateData } = req.body;
    const person = await prisma.person.update({ where: { id: req.params.id }, data: updateData });
    res.json(person);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await prisma.person.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Persona no encontrada' });
    await prisma.person.delete({ where: { id: req.params.id } });
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
