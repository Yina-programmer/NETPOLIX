const router = require('express').Router();
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prismaClient');
const { generateToken, authenticateToken } = require('../middleware/auth');

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), active: true }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Check if penalized
    if (user.penalized) {
      return res.status(403).json({ error: 'Tu cuenta ha sido penalizada. Contacta al administrador.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor: ' + error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, documentId, email, password, referredBy } = req.body;

    // Validations
    if (!name || !documentId || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (email.length < 6 || email.length > 25) {
      return res.status(400).json({ error: 'El email debe tener entre 6 y 25 caracteres' });
    }

    if (password.length < 7 || password.length > 15) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 7 y 15 caracteres' });
    }

    const existingEmail = await prisma.user.findFirst({ where: { email: email.toLowerCase() } });
    if (existingEmail) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const existingDoc = await prisma.user.findFirst({ where: { documentId } });
    if (existingDoc) {
      return res.status(400).json({ error: 'El documento ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = name.split(' ')[0].toUpperCase().substring(0, 4) + documentId.substring(0, 4);

    let actualReferredBy = null;

    // Handle referral points
    if (referredBy) {
      const referrer = await prisma.user.findFirst({
        where: { OR: [{ documentId: referredBy }, { referralCode: referredBy }] }
      });
      if (referrer) {
        const config = await prisma.config.findUnique({ where: { id: 1 } });
        await prisma.user.update({
          where: { id: referrer.id },
          data: { points: (referrer.points || 0) + (config?.pointsPerReferral || 50) }
        });
        actualReferredBy = referrer.documentId;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        id: generateId(),
        name,
        documentId,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'cliente',
        registrationDate: new Date(),
        points: 0,
        referralCode,
        referredBy: actualReferredBy,
        penalized: false,
        active: true
      }
    });

    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor: ' + error.message });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor: ' + error.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { name, email, currentPassword, newPassword } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      if (email.length < 6 || email.length > 25) {
        return res.status(400).json({ error: 'El email debe tener entre 6 y 25 caracteres' });
      }
      const existingEmail = await prisma.user.findFirst({
        where: { email: email.toLowerCase(), NOT: { id: req.user.id } }
      });
      if (existingEmail) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
      updateData.email = email.toLowerCase();
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'La contraseña actual es requerida' });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
      if (newPassword.length < 7 || newPassword.length > 15) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener entre 7 y 15 caracteres' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({ where: { id: req.user.id }, data: updateData });
    const { password, ...userWithoutPassword } = updated;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor: ' + error.message });
  }
});

module.exports = router;
