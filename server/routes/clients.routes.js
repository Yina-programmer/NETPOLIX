const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// GET all clients (admin)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const clients = await prisma.user.findMany({
      where: { role: 'cliente' },
      select: {
        id: true, name: true, documentId: true, email: true, role: true,
        registrationDate: true, points: true, referralCode: true, referredBy: true,
        penalized: true, penalizedReason: true, active: true, createdAt: true
      }
    });
    res.json(clients);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET client by id
router.get('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, role: 'cliente' }
    });
    if (!user) return res.status(404).json({ error: 'Cliente no encontrado' });
    const { password, ...u } = user;
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT penalize/un-penalize client
router.put('/:id/penalize', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'Cliente no encontrado' });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        penalized: !user.penalized,
        penalizedReason: req.body.reason || 'Tarjeta de crédito vencida o robada'
      }
    });
    const { password, ...u } = updated;
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
