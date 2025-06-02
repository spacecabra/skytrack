// Componentes reutilizables para la aplicación

export class UIComponents {
  // Crear tabla de datos
  static createTable(data, columns, options = {}) {
    if (!data || data.length === 0) {
      return '<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>No hay datos disponibles</div>';
    }

    const showActions = options.showActions !== false;
    const customActions = options.customActions || [];

    let html = `
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
    `;

    // Encabezados de columnas
    columns.forEach(col => {
      html += `<th><i class="${col.icon || 'fas fa-list'} me-1"></i>${col.label}</th>`;
    });
    
    if (showActions) {
      html += '<th><i class="fas fa-cogs me-1"></i>Acciones</th>';
    }
    
    html += '</tr></thead><tbody>';

    // Filas de datos
    data.forEach(item => {
      html += '<tr>';
      columns.forEach(col => {
        let value = this.getNestedValue(item, col.field);
        
        // Formatear valores según el tipo
        if (col.type === 'date' && value) {
          value = new Date(value).toLocaleDateString('es-ES');
        } else if (col.type === 'currency' && value) {
          value = `$${parseFloat(value).toLocaleString('es-ES', {minimumFractionDigits: 2})}`;
        } else if (col.type === 'boolean') {
          value = value 
            ? '<span class="badge bg-success"><i class="fas fa-check"></i> Sí</span>'
            : '<span class="badge bg-danger"><i class="fas fa-times"></i> No</span>';
        } else if (col.type === 'status') {
          const statusClass = this.getStatusClass(value);
          value = `<span class="badge ${statusClass}">${value}</span>`;
        }
        
        html += `<td>${value || '-'}</td>`;
      });
      
      // Botones de acción
      if (showActions) {
        html += '<td>';
        html += `
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-primary" onclick="editItem(${item.id})" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-info" onclick="viewItem(${item.id})" title="Ver">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-outline-danger" onclick="deleteItem(${item.id})" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Acciones personalizadas
        customActions.forEach(action => {
          html += `
            <button class="btn btn-outline-${action.color || 'secondary'}" 
                    onclick="${action.handler}(${item.id})" 
                    title="${action.title}">
              <i class="${action.icon}"></i>
            </button>
          `;
        });
        
        html += '</div></td>';
      }
      
      html += '</tr>';
    });

    html += '</tbody></table></div></div></div>';
    return html;
  }

  // Obtener valor anidado de un objeto
  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  // Obtener clase CSS para estados
  static getStatusClass(status) {
    const statusMap = {
      'ACTIVO': 'bg-success',
      'INACTIVO': 'bg-danger',
      'BAJA': 'bg-danger',
      'RECORRIDO': 'bg-warning',
      'PREVENTIVO': 'bg-info',
      'CORRECTIVO': 'bg-warning',
      'EXITOSO': 'bg-success',
      'PENDIENTE': 'bg-warning',
      'FALLIDO': 'bg-danger',
      'ACTIVA': 'bg-success',
      'FINALIZADA': 'bg-secondary'
    };
    return statusMap[status] || 'bg-secondary';
  }

  // Crear cards de estadísticas
  static createStatsCard(title, value, icon, color = 'primary') {
    return `
      <div class="col-md-3 mb-4">
        <div class="card text-white bg-${color} h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h4 class="card-title">${value}</h4>
                <p class="card-text">${title}</p>
              </div>
              <div class="align-self-center">
                <i class="${icon} fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Crear formulario dinámico
  static createForm(fields, data = {}) {
    let html = '<form id="dynamicForm">';
    
    fields.forEach(field => {
      const value = data[field.name] || '';
      
      html += `<div class="mb-3">`;
      html += `<label for="${field.name}" class="form-label">${field.label}`;
      if (field.required) html += ' <span class="text-danger">*</span>';
      html += '</label>';
      
      switch (field.type) {
        case 'select':
          html += `<select class="form-select" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
          html += '<option value="">Seleccionar...</option>';
          field.options.forEach(option => {
            const selected = value == option.value ? 'selected' : '';
            html += `<option value="${option.value}" ${selected}>${option.label}</option>`;
          });
          html += '</select>';
          break;
          
        case 'textarea':
          html += `<textarea class="form-control" id="${field.name}" name="${field.name}" 
                   rows="${field.rows || 3}" ${field.required ? 'required' : ''}>${value}</textarea>`;
          break;
          
        case 'date':
          html += `<input type="date" class="form-control" id="${field.name}" name="${field.name}" 
                   value="${value}" ${field.required ? 'required' : ''}>`;
          break;
          
        case 'number':
          html += `<input type="number" class="form-control" id="${field.name}" name="${field.name}" 
                   value="${value}" ${field.required ? 'required' : ''} 
                   ${field.min ? `min="${field.min}"` : ''} ${field.max ? `max="${field.max}"` : ''}>`;
          break;
          
        case 'email':
          html += `<input type="email" class="form-control" id="${field.name}" name="${field.name}" 
                   value="${value}" ${field.required ? 'required' : ''}>`;
          break;
          
        default: // text
          html += `<input type="text" class="form-control" id="${field.name}" name="${field.name}" 
                   value="${value}" ${field.required ? 'required' : ''}>`;
      }
      
      if (field.help) {
        html += `<div class="form-text">${field.help}</div>`;
      }
      
      html += '</div>';
    });
    
    html += '</form>';
    return html;
  }

  // Crear alertas
  static createAlert(message, type = 'info', dismissible = true) {
    const alertClass = `alert-${type}`;
    const dismissButton = dismissible 
      ? '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>'
      : '';
    
    return `
      <div class="alert ${alertClass} ${dismissible ? 'alert-dismissible' : ''} fade show">
        <i class="${this.getAlertIcon(type)} me-2"></i>${message}
        ${dismissButton}
      </div>
    `;
  }

  static getAlertIcon(type) {
    const iconMap = {
      'success': 'fas fa-check-circle',
      'danger': 'fas fa-exclamation-triangle',
      'warning': 'fas fa-exclamation-circle',
      'info': 'fas fa-info-circle'
    };
    return iconMap[type] || 'fas fa-info-circle';
  }

  // Crear paginación
  static createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';
    
    let html = '<nav><ul class="pagination justify-content-center">';
    
    // Botón anterior
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    html += `
      <li class="page-item ${prevDisabled}">
        <a class="page-link" href="#" onclick="${onPageChange}(${currentPage - 1})">
          <i class="fas fa-chevron-left"></i>
        </a>
      </li>
    `;
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
      const active = i === currentPage ? 'active' : '';
      html += `
        <li class="page-item ${active}">
          <a class="page-link" href="#" onclick="${onPageChange}(${i})">${i}</a>
        </li>
      `;
    }
    
    // Botón siguiente
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    html += `
      <li class="page-item ${nextDisabled}">
        <a class="page-link" href="#" onclick="${onPageChange}(${currentPage + 1})">
          <i class="fas fa-chevron-right"></i>
        </a>
      </li>
    `;
    
    html += '</ul></nav>';
    return html;
  }

  // Crear loading spinner
  static createLoading(text = 'Cargando...') {
    return `
      <div class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">${text}</span>
        </div>
        <div class="text-muted">${text}</div>
      </div>
    `;
  }

  // Crear breadcrumb
  static createBreadcrumb(items) {
    let html = '<nav aria-label="breadcrumb"><ol class="breadcrumb">';
    
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const activeClass = isLast ? 'active' : '';
      
      html += `<li class="breadcrumb-item ${activeClass}">`;
      if (!isLast && item.href) {
        html += `<a href="${item.href}">${item.text}</a>`;
      } else {
        html += item.text;
      }
      html += '</li>';
    });
    
    html += '</ol></nav>';
    return html;
  }

  // Crear cards de estadísticas
  static createStatsCard(title, value, icon, color = 'primary') {
    return `
      <div class="col-md-3 mb-4">
        <div class="card text-white bg-${color} h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h4 class="card-title">${value}</h4>
                <p class="card-text">${title}</p>
              </div>
              <div class="align-self-center">
                <i class="${icon} fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Crear formulario dinámico
  // Crear formulario dinámico mejorado
  static createForm(fields, data = {}, referenceData = {}) {
    let html = '<form id="dynamicForm" novalidate>';
    
    fields.forEach(field => {
      const value = data[field.name] || '';
      
      html += `<div class="mb-3">`;
      html += `<label for="${field.name}" class="form-label">${field.label}`;
      if (field.required) html += ' <span class="text-danger">*</span>';
      html += '</label>';
      
      // Agregar atributos comunes
      const commonAttrs = `
        id="${field.name}" 
        name="${field.name}" 
        class="form-control" 
        ${field.required ? 'required' : ''}
        ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}
        ${field.pattern ? `pattern="${field.pattern}"` : ''}
        ${field.step ? `step="${field.step}"` : ''}
      `;
      
      switch (field.type) {
        case 'select':
          html += `<select ${commonAttrs} ${field.onChange ? `onchange="${field.onChange}(this.value)"` : ''}>`;
          html += '<option value="">Seleccionar...</option>';
          
          // Si tiene dataSource, usar datos de referencia
          if (field.dataSource && referenceData[field.dataSource]) {
            referenceData[field.dataSource].forEach(option => {
              const optionValue = option[field.valueField || 'value'];
              let optionLabel;
              
              // Si tiene customLabel, usarlo
              if (field.customLabel && typeof field.customLabel === 'function') {
                optionLabel = field.customLabel(option);
              } else {
                optionLabel = option[field.labelField || 'label'];
              }
              
              const selected = value == optionValue ? 'selected' : '';
              html += `<option value="${optionValue}" ${selected}>${optionLabel}</option>`;
            });
          }
          // Si tiene options estáticas
          else if (field.options) {
            field.options.forEach(option => {
              const selected = value == option.value ? 'selected' : '';
              html += `<option value="${option.value}" ${selected}>${option.label}</option>`;
            });
          }
          
          html += '</select>';
          break;
          
        case 'textarea':
          html += `<textarea ${commonAttrs} rows="${field.rows || 3}">${value}</textarea>`;
          break;
          
        case 'date':
          html += `<input type="date" ${commonAttrs} value="${value}">`;
          break;
          
        case 'number':
          html += `<input type="number" ${commonAttrs} value="${value}" 
                   ${field.min !== undefined ? `min="${field.min}"` : ''} 
                   ${field.max !== undefined ? `max="${field.max}"` : ''}">`;
          break;
          
        case 'email':
          html += `<input type="email" ${commonAttrs} value="${value}">`;
          break;
          
        default: // text
          html += `<input type="text" ${commonAttrs} value="${value}">`;
      }
      
      // Mensaje de validación
      html += `<div class="invalid-feedback" id="${field.name}-error"></div>`;
      
      if (field.help) {
        html += `<div class="form-text">${field.help}</div>`;
      }
      
      html += '</div>';
    });
    
    html += '</form>';
    return html;
  }

  // Validar formulario
  static validateForm(fields) {
    const form = document.getElementById('dynamicForm');
    let isValid = true;
    
    fields.forEach(field => {
      const input = form.querySelector(`[name="${field.name}"]`);
      const errorDiv = document.getElementById(`${field.name}-error`);
      
      // Limpiar errores anteriores
      input.classList.remove('is-invalid');
      errorDiv.textContent = '';
      
      // Validar campo requerido
      if (field.required && (!input.value || input.value.trim() === '')) {
        input.classList.add('is-invalid');
        errorDiv.textContent = `${field.label} es requerido`;
        isValid = false;
        return;
      }
      
      // Validar email
      if (field.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.classList.add('is-invalid');
          errorDiv.textContent = 'Email no válido';
          isValid = false;
          return;
        }
      }
      
      // Validar patrón
      if (field.pattern && input.value) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(input.value)) {
          input.classList.add('is-invalid');
          errorDiv.textContent = 'Formato no válido';
          isValid = false;
          return;
        }
      }
      
      // Validar números
      if (field.type === 'number' && input.value) {
        const numValue = parseFloat(input.value);
        if (field.min !== undefined && numValue < field.min) {
          input.classList.add('is-invalid');
          errorDiv.textContent = `Valor mínimo: ${field.min}`;
          isValid = false;
          return;
        }
        if (field.max !== undefined && numValue > field.max) {
          input.classList.add('is-invalid');
          errorDiv.textContent = `Valor máximo: ${field.max}`;
          isValid = false;
          return;
        }
      }
      
      // Si llegó hasta aquí, el campo es válido
      input.classList.add('is-valid');
    });
    
    return isValid;
  }

  // Obtener datos del formulario con validación
  static getFormData(fields) {
    const form = document.getElementById('dynamicForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      // Convertir valores booleanos
      const field = fields.find(f => f.name === key);
      if (field && field.type === 'select' && field.options) {
        const option = field.options.find(opt => opt.value == value);
        if (option && typeof option.value === 'boolean') {
          data[key] = option.value;
        } else {
          data[key] = value;
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  }

  // Crear alertas
  static createAlert(message, type = 'info', dismissible = true) {
    const alertClass = `alert-${type}`;
    const dismissButton = dismissible 
      ? '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>'
      : '';
    
    return `
      <div class="alert ${alertClass} ${dismissible ? 'alert-dismissible' : ''} fade show">
        <i class="${this.getAlertIcon(type)} me-2"></i>${message}
        ${dismissButton}
      </div>
    `;
  }

  static getAlertIcon(type) {
    const iconMap = {
      'success': 'fas fa-check-circle',
      'danger': 'fas fa-exclamation-triangle',
      'warning': 'fas fa-exclamation-circle',
      'info': 'fas fa-info-circle'
    };
    return iconMap[type] || 'fas fa-info-circle';
  }

  // Crear paginación
  static createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';
    
    let html = '<nav><ul class="pagination justify-content-center">';
    
    // Botón anterior
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    html += `
      <li class="page-item ${prevDisabled}">
        <a class="page-link" href="#" onclick="${onPageChange}(${currentPage - 1})">
          <i class="fas fa-chevron-left"></i>
        </a>
      </li>
    `;
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
      const active = i === currentPage ? 'active' : '';
      html += `
        <li class="page-item ${active}">
          <a class="page-link" href="#" onclick="${onPageChange}(${i})">${i}</a>
        </li>
      `;
    }
    
    // Botón siguiente
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    html += `
      <li class="page-item ${nextDisabled}">
        <a class="page-link" href="#" onclick="${onPageChange}(${currentPage + 1})">
          <i class="fas fa-chevron-right"></i>
        </a>
      </li>
    `;
    
    html += '</ul></nav>';
    return html;
  }

  // Crear loading spinner
  static createLoading(text = 'Cargando...') {
    return `
      <div class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">${text}</span>
        </div>
        <div class="text-muted">${text}</div>
      </div>
    `;
  }

  // Crear breadcrumb
  static createBreadcrumb(items) {
    let html = '<nav aria-label="breadcrumb"><ol class="breadcrumb">';
    
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const activeClass = isLast ? 'active' : '';
      
      html += `<li class="breadcrumb-item ${activeClass}">`;
      if (!isLast && item.href) {
        html += `<a href="${item.href}">${item.text}</a>`;
      } else {
        html += item.text;
      }
      html += '</li>';
    });
    
    html += '</ol></nav>';
    return html;
  }
}