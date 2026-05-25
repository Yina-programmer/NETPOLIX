/**
 * NetPolix Modal System
 * Reusable modal dialogs
 */
(function() {
  let overlay = document.getElementById('modal-overlay');
  
  function ensureOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = '<div class="modal" id="modal-container"></div>';
      document.body.appendChild(overlay);
      
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
          closeModal();
        }
      });
    }
    return overlay;
  }

  function showModal(title, bodyHTML, footerHTML = '', options = {}) {
    const ov = ensureOverlay();
    const modal = ov.querySelector('.modal') || ov.querySelector('#modal-container');
    
    const size = options.size === 'lg' ? 'modal-lg' : '';
    modal.className = `modal ${size}`;
    
    modal.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        ${bodyHTML}
      </div>
      ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
    `;

    ov.classList.add('active');
    document.body.style.overflow = 'hidden';

    return modal;
  }

  function closeModal() {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function confirmModal(title, message, onConfirm) {
    const bodyHTML = `<p style="color: var(--text-secondary); margin-bottom: 0;">${message}</p>`;
    const footerHTML = `
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-danger" id="modal-confirm-btn">Confirmar</button>
    `;
    
    const modal = showModal(title, bodyHTML, footerHTML);
    
    modal.querySelector('#modal-confirm-btn').addEventListener('click', () => {
      closeModal();
      if (onConfirm) onConfirm();
    });
  }

  window.showModal = showModal;
  window.closeModal = closeModal;
  window.confirmModal = confirmModal;
})();
