/**
 * NetPolix Notification System
 * Toast notifications with auto-dismiss
 */
(function() {
  // Create notification container
  let container = document.querySelector('.notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  function showNotification(message, type = 'info', duration = 4000) {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `
      <span class="notif-icon">${icons[type] || icons.info}</span>
      <span class="notif-message">${message}</span>
      <button class="notif-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(notif);

    // Auto-remove
    if (duration > 0) {
      setTimeout(() => {
        notif.classList.add('removing');
        setTimeout(() => notif.remove(), 300);
      }, duration);
    }

    return notif;
  }

  window.showNotification = showNotification;
})();
