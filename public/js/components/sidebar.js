/**
 * NetPolix Sidebar Component
 * Dynamic sidebar based on user role
 */
function renderSidebar(role) {
  const user = AuthManager.getUser();
  const initials = AuthManager.getUserInitials(user?.name);
  const roleName = AuthManager.getRoleName(role);
  const currentPage = window.location.pathname.split('/').pop();

  const adminLinks = `
    <div class="sidebar-section">
      <div class="sidebar-section-title">Principal</div>
      <a href="/admin/dashboard.html" class="sidebar-link ${currentPage === 'dashboard.html' ? 'active' : ''}">
        <span class="link-icon">📊</span> Dashboard
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Catálogo</div>
      <a href="/admin/movies.html" class="sidebar-link ${currentPage === 'movies.html' ? 'active' : ''}">
        <span class="link-icon">🎬</span> Películas
      </a>
      <a href="/admin/series.html" class="sidebar-link ${currentPage === 'series.html' ? 'active' : ''}">
        <span class="link-icon">📺</span> Series
      </a>
      <a href="/admin/collections.html" class="sidebar-link ${currentPage === 'collections.html' ? 'active' : ''}">
        <span class="link-icon">📦</span> Colecciones
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Gestión</div>
      <a href="/admin/people.html" class="sidebar-link ${currentPage === 'people.html' ? 'active' : ''}">
        <span class="link-icon">👥</span> Personas
      </a>
      <a href="/admin/categories.html" class="sidebar-link ${currentPage === 'categories.html' ? 'active' : ''}">
        <span class="link-icon">🏷️</span> Categorías
      </a>
      <a href="/admin/languages.html" class="sidebar-link ${currentPage === 'languages.html' ? 'active' : ''}">
        <span class="link-icon">🌐</span> Idiomas
      </a>
      <a href="/admin/classifications.html" class="sidebar-link ${currentPage === 'classifications.html' ? 'active' : ''}">
        <span class="link-icon">🔒</span> Clasificaciones
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Administración</div>
      <a href="/admin/users.html" class="sidebar-link ${currentPage === 'users.html' ? 'active' : ''}">
        <span class="link-icon">🛡️</span> Usuarios
      </a>
      <a href="/admin/clients.html" class="sidebar-link ${currentPage === 'clients.html' ? 'active' : ''}">
        <span class="link-icon">👤</span> Clientes
      </a>
      <a href="/admin/config.html" class="sidebar-link ${currentPage === 'config.html' ? 'active' : ''}">
        <span class="link-icon">⚙️</span> Configuración
      </a>
    </div>
  `;

  const managerLinks = `
    <div class="sidebar-section">
      <div class="sidebar-section-title">Reportes</div>
      <a href="/manager/dashboard.html" class="sidebar-link ${currentPage === 'dashboard.html' ? 'active' : ''}">
        <span class="link-icon">📊</span> Dashboard
      </a>
    </div>
  `;

  const clientLinks = `
    <div class="sidebar-section">
      <div class="sidebar-section-title">Tienda</div>
      <a href="/client/catalog.html" class="sidebar-link ${currentPage === 'catalog.html' ? 'active' : ''}">
        <span class="link-icon">🎬</span> Catálogo
      </a>
      <a href="/client/cart.html" class="sidebar-link ${currentPage === 'cart.html' ? 'active' : ''}">
        <span class="link-icon">🛒</span> Carrito
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Mi Cuenta</div>
      <a href="/client/profile.html" class="sidebar-link ${currentPage === 'profile.html' ? 'active' : ''}">
        <span class="link-icon">👤</span> Mi Perfil
      </a>
      <a href="/client/history.html" class="sidebar-link ${currentPage === 'history.html' ? 'active' : ''}">
        <span class="link-icon">📋</span> Historial
      </a>
    </div>
  `;

  let navLinks = '';
  switch (role) {
    case 'admin': navLinks = adminLinks; break;
    case 'gerente': navLinks = managerLinks; break;
    case 'cliente': navLinks = clientLinks; break;
  }

  const sidebarHTML = `
    <div class="sidebar-header">
      <img src="/assets/logo-netpolix.png" alt="NetPolix" class="sidebar-logo">
      <span class="sidebar-brand">NetPolix</span>
    </div>
    <nav class="sidebar-nav">
      ${navLinks}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="avatar avatar-sm">${initials}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${user?.name || 'Usuario'}</div>
          <div class="sidebar-user-role">${roleName}</div>
        </div>
        <button class="sidebar-logout" onclick="NetPolixAPI.logout()" title="Cerrar sesión">🚪</button>
      </div>
    </div>
  `;

  // Find or create sidebar
  let sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    const appLayout = document.querySelector('.app-layout');
    if (appLayout) {
      appLayout.insertBefore(sidebar, appLayout.firstChild);
    } else {
      document.body.insertBefore(sidebar, document.body.firstChild);
    }
  }

  sidebar.innerHTML = sidebarHTML;

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

window.renderSidebar = renderSidebar;
