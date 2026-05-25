/**
 * Role-based access control middleware
 * @param  {...string} roles - Allowed roles
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticación requerida' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}` 
      });
    }
    next();
  };
}

module.exports = { authorizeRoles };
