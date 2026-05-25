/**
 * NetPolix File Upload Component
 * Drag & drop Excel file upload with preview
 */
function createFileUpload(containerId, config = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const {
    accept = '.xlsx,.xls',
    maxSize = 10 * 1024 * 1024, // 10MB
    onFileSelected,
    templateUrl = '/api/upload/template',
    label = 'Arrastra tu archivo Excel aquí',
    hint = 'O haz clic para seleccionar. Máximo 10MB.',
  } = config;

  container.innerHTML = `
    <div class="file-upload" id="${containerId}-dropzone">
      <input type="file" accept="${accept}" id="${containerId}-input">
      <div class="upload-icon">📄</div>
      <div class="upload-text">${label}</div>
      <div class="upload-hint">${hint}</div>
    </div>
    <div id="${containerId}-preview" class="hidden mt-4">
      <div class="flex items-center justify-between p-4" style="background:var(--bg-surface);border-radius:var(--radius-md);border:1px solid var(--border-color);">
        <div class="flex items-center gap-3">
          <span style="font-size:1.5rem;">📊</span>
          <div>
            <div id="${containerId}-filename" class="fw-medium" style="font-size:var(--fs-sm);"></div>
            <div id="${containerId}-filesize" class="text-muted" style="font-size:var(--fs-xs);"></div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="resetFileUpload('${containerId}')">✕</button>
      </div>
    </div>
    ${templateUrl ? `
    <div class="mt-4" style="text-align:center;">
      <a href="${templateUrl}" class="btn btn-outline btn-sm" download>
        📥 Descargar plantilla Excel
      </a>
    </div>
    ` : ''}
  `;

  const dropzone = document.getElementById(`${containerId}-dropzone`);
  const input = document.getElementById(`${containerId}-input`);
  const preview = document.getElementById(`${containerId}-preview`);

  // Drag events
  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  function handleFile(file) {
    if (file.size > maxSize) {
      showNotification('El archivo excede el tamaño máximo permitido', 'error');
      return;
    }

    document.getElementById(`${containerId}-filename`).textContent = file.name;
    document.getElementById(`${containerId}-filesize`).textContent = formatFileSize(file.size);
    
    dropzone.classList.add('hidden');
    preview.classList.remove('hidden');

    if (onFileSelected) onFileSelected(file);
  }
}

function resetFileUpload(containerId) {
  const dropzone = document.getElementById(`${containerId}-dropzone`);
  const preview = document.getElementById(`${containerId}-preview`);
  const input = document.getElementById(`${containerId}-input`);
  
  if (dropzone) dropzone.classList.remove('hidden');
  if (preview) preview.classList.add('hidden');
  if (input) input.value = '';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

window.createFileUpload = createFileUpload;
window.resetFileUpload = resetFileUpload;
