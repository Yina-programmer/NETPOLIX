/**
 * NetPolix Auth Manager
 * Session validation and role-based access control for pages
 */
const AuthManager = {
  checkAuth() {
    const token = NetPolixAPI.getToken();
    const user = NetPolixAPI.getUser();
    if (!token || !user) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  redirectIfNotRole(requiredRoles) {
    const user = NetPolixAPI.getUser();
    if (!user) {
      window.location.href = '/login.html';
      return false;
    }
    if (!requiredRoles.includes(user.role)) {
      // Redirect to appropriate dashboard
      switch (user.role) {
        case 'admin': window.location.href = '/admin/dashboard.html'; break;
        case 'gerente': window.location.href = '/manager/dashboard.html'; break;
        case 'cliente': window.location.href = '/client/catalog.html'; break;
        default: window.location.href = '/login.html';
      }
      return false;
    }
    return true;
  },

  getUser() {
    return NetPolixAPI.getUser();
  },

  getUserInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  },

  getRoleName(role) {
    const roles = {
      'admin': 'Administrador',
      'gerente': 'Gerente',
      'cliente': 'Cliente'
    };
    return roles[role] || role;
  },

  redirectToDashboard() {
    const user = NetPolixAPI.getUser();
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    switch (user.role) {
      case 'admin': window.location.href = '/admin/dashboard.html'; break;
      case 'gerente': window.location.href = '/manager/dashboard.html'; break;
      case 'cliente': window.location.href = '/client/catalog.html'; break;
      default: window.location.href = '/';
    }
  }
};

window.AuthManager = AuthManager;
