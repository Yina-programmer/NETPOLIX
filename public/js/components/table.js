/**
 * NetPolix Dynamic Table Component
 * Creates sortable, filterable tables with action buttons
 */
function createTable(containerId, config) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const { columns, data, actions, emptyMessage, onRowClick } = config;

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>${emptyMessage || 'No hay datos disponibles'}</h3>
        <p>Los datos aparecerán aquí cuando estén disponibles.</p>
      </div>
    `;
    return;
  }

  let tableHTML = `
    <div class="table-container">
      <table class="neon-table">
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
            ${actions ? '<th style="text-align: right;">Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach((row, index) => {
    const clickAttr = onRowClick ? `style="cursor:pointer" data-row-index="${index}"` : '';
    tableHTML += `<tr ${clickAttr}>`;
    
    columns.forEach(col => {
      let value = row[col.key];
      
      // Custom render function
      if (col.render) {
        value = col.render(value, row);
      } else if (col.type === 'badge') {
        const badgeClass = col.badgeMap?.[value] || 'badge-gray';
        value = `<span class="badge ${badgeClass}">${value || '-'}</span>`;
      } else if (col.type === 'date') {
        value = value ? new Date(value).toLocaleDateString('es-CO') : '-';
      } else if (col.type === 'currency') {
        value = value != null ? `$${parseFloat(value).toFixed(2)}` : '-';
      } else if (col.type === 'rating') {
        const stars = getStarsHTML(value);
        value = stars;
      } else if (col.type === 'array') {
        if (Array.isArray(value)) {
          value = value.map(v => `<span class="tag">${v}</span>`).join(' ');
        } else {
          value = '-';
        }
      } else if (col.type === 'image') {
        value = value ? `<img src="${value}" alt="" style="width:40px;height:55px;object-fit:cover;border-radius:4px;">` : '';
      } else {
        value = value ?? '-';
      }

      tableHTML += `<td>${value}</td>`;
    });

    if (actions) {
      tableHTML += '<td style="text-align: right;"><div class="btn-group" style="justify-content:flex-end;">';
      actions.forEach(action => {
        if (action.condition && !action.condition(row)) return;
        const btnClass = action.class || 'btn-ghost btn-sm';
        tableHTML += `<button class="btn ${btnClass}" data-action="${action.name}" data-id="${row.id}" title="${action.label}">${action.icon || action.label}</button>`;
      });
      tableHTML += '</div></td>';
    }

    tableHTML += '</tr>';
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHTML;

  // Bind action clicks
  if (actions) {
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const actionName = btn.dataset.action;
        const id = btn.dataset.id;
        const action = actions.find(a => a.name === actionName);
        if (action?.onClick) {
          const row = data.find(r => r.id === id);
          action.onClick(row, id);
        }
      });
    });
  }

  // Bind row clicks
  if (onRowClick) {
    container.querySelectorAll('[data-row-index]').forEach(tr => {
      tr.addEventListener('click', () => {
        const index = parseInt(tr.dataset.rowIndex);
        onRowClick(data[index]);
      });
    });
  }
}

function getStarsHTML(rating) {
  const ratingMap = { 'excelente': 5, 'buena': 4, 'regular': 3, 'mala': 2 };
  const numStars = ratingMap[rating] || 0;
  let html = '<div class="star-rating">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= numStars ? 'filled' : ''}">★</span>`;
  }
  html += '</div>';
  return html;
}

window.createTable = createTable;
window.getStarsHTML = getStarsHTML;
