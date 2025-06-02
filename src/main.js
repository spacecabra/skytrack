import './style.css';
import ApiService from './api.js';
import { UIComponents } from './components.js';

// Sistema de autenticación
window.AuthService = {
  async login(username, password) {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

// Función para mostrar formulario de login
function showLoginForm() {
  document.getElementById('app').innerHTML = `
    <div class="d-flex align-items-center justify-content-center min-vh-100" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="card shadow-lg" style="width: 400px;">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <img src="/skytrack-logo.png" alt="Skytrack" class="mb-3" style="width: 64px; height: 64px;">
<h2 class="card-title">Skytrack</h2>
<p class="text-muted">Sistema de Inventario</p>
          </div>
          
          <form id="loginForm">
            <div class="mb-3">
              <label for="username" class="form-label">Usuario</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-user"></i></span>
                <input type="text" class="form-control" id="username" required>
              </div>
            </div>
            
            <div class="mb-4">
              <label for="password" class="form-label">Contraseña</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-lock"></i></span>
                <input type="password" class="form-control" id="password" required>
              </div>
            </div>
            
            <div id="error-message" class="alert alert-danger" style="display: none;"></div>
            
            <button type="submit" class="btn btn-primary w-100 mb-3" id="loginBtn">
              <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
            </button>
            
            <div class="text-center">
              <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Usa las credenciales del superuser
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Manejar envío del formulario
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('error-message');
    
    // Mostrar loading
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando sesión...';
    errorMessage.style.display = 'none';
    
    try {
      await AuthService.login(username, password);
      
      // Mostrar éxito
      loginBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Éxito!';
      loginBtn.classList.remove('btn-primary');
      loginBtn.classList.add('btn-success');
      
      // Redirigir al dashboard
      setTimeout(() => {
        initializeApp();
      }, 1000);
      
    } catch (error) {
      // Mostrar error
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
      
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión';
    }
  });
}

// Estado global de la aplicación
const AppState = {
  currentModule: 'dashboard',
  currentData: {},
  currentPage: 1,
  isLoading: false,
  filters: {},
  modalMode: 'create', // 'create' o 'edit'
  referenceData: {} // Datos de referencia para formularios
};

// Configuración de módulos con sus columnas y campos de formulario
const ModuleConfig = {
  equipos: {
    title: 'Equipos',
    icon: 'fas fa-desktop',
    columns: [
      { field: 'nombre', label: 'Nombre', icon: 'fas fa-desktop' },
      { field: 'serie', label: 'Serie', icon: 'fas fa-barcode' },
      { field: 'modelo_nombre', label: 'Modelo', icon: 'fas fa-cog' },
      { field: 'estado_nombre', label: 'Estado', icon: 'fas fa-traffic-light', type: 'status' },
      { field: 'ubicacion_nombre', label: 'Ubicación', icon: 'fas fa-map-marker-alt' },
      { field: 'area_nombre', label: 'Área', icon: 'fas fa-building' }
    ],
    formFields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'serie', label: 'Número de Serie', type: 'text', required: true },
      { 
        name: 'categoria', 
        label: 'Categoría', 
        type: 'select', 
        required: true,
        dataSource: 'categorias',
        valueField: 'id',
        labelField: 'nombre'
      },
      { 
        name: 'fabricante', 
        label: 'Fabricante', 
        type: 'select', 
        required: true,
        dataSource: 'fabricantes',
        valueField: 'id',
        labelField: 'nombre',
        onChange: 'loadModelos' // Función que se ejecuta al cambiar
      },
      { 
        name: 'modelo', 
        label: 'Modelo', 
        type: 'select', 
        required: true,
        dataSource: 'modelos',
        valueField: 'id',
        labelField: 'nombre',
        dependsOn: 'fabricante' // Depende del fabricante
      },
      { 
        name: 'estado', 
        label: 'Estado', 
        type: 'select', 
        required: true,
        dataSource: 'estados',
        valueField: 'id',
        labelField: 'nombre'
      },
      { 
        name: 'ubicacion', 
        label: 'Ubicación', 
        type: 'select', 
        required: true,
        dataSource: 'ubicaciones',
        valueField: 'id',
        labelField: 'nombre'
      },
      { 
        name: 'area', 
        label: 'Área', 
        type: 'select', 
        required: true,
        dataSource: 'areas',
        valueField: 'id',
        labelField: 'nombre'
      },
      { name: 'sistema_operativo', label: 'Sistema Operativo', type: 'text' },
      { name: 'procesador', label: 'Procesador', type: 'text' },
      { name: 'memoria_ram', label: 'Memoria RAM', type: 'text' },
      { name: 'disco_duro', label: 'Disco Duro', type: 'text' },
      { name: 'direccion_ip', label: 'Dirección IP', type: 'text', pattern: '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$' },
      { name: 'fecha_compra', label: 'Fecha de Compra', type: 'date' },
      { name: 'fecha_fin_garantia', label: 'Fecha Fin Garantía', type: 'date' },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 3 }
    ]
  },
  usuarios: {
    title: 'Usuarios',
    icon: 'fas fa-users',
    columns: [
      { field: 'nombre_usuario', label: 'Usuario', icon: 'fas fa-user' },
      { field: 'nombre_completo', label: 'Nombre Completo', icon: 'fas fa-id-card' },
      { field: 'email', label: 'Email', icon: 'fas fa-envelope' },
      { field: 'area_nombre', label: 'Área', icon: 'fas fa-building' },
      { field: 'ubicacion_nombre', label: 'Ubicación', icon: 'fas fa-map-marker-alt' },
      { field: 'activo', label: 'Activo', icon: 'fas fa-check-circle', type: 'boolean' }
    ],
    formFields: [
      { name: 'nombre_usuario', label: 'Nombre de Usuario', type: 'text', required: true },
      { name: 'nombre_completo', label: 'Nombre Completo', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { 
        name: 'area', 
        label: 'Área', 
        type: 'select', 
        required: true,
        dataSource: 'areas',
        valueField: 'id',
        labelField: 'nombre'
      },
      { 
        name: 'ubicacion', 
        label: 'Ubicación', 
        type: 'select', 
        required: true,
        dataSource: 'ubicaciones',
        valueField: 'id',
        labelField: 'nombre'
      },
      { 
        name: 'activo', 
        label: 'Activo', 
        type: 'select', 
        required: true,
        options: [
          { value: true, label: 'Sí' },
          { value: false, label: 'No' }
        ]
      }
    ]
  },
  asignaciones: {
    title: 'Asignaciones',
    icon: 'fas fa-handshake',
    columns: [
      { field: 'equipo_nombre', label: 'Equipo', icon: 'fas fa-desktop' },
      { field: 'usuario_nombre', label: 'Usuario', icon: 'fas fa-user' },
      { field: 'fecha_asignacion', label: 'Fecha Asignación', icon: 'fas fa-calendar', type: 'date' },
      { field: 'estado_asignacion', label: 'Estado', icon: 'fas fa-info-circle', type: 'status' },
      { field: 'motivo_asignacion', label: 'Motivo', icon: 'fas fa-comment' }
    ],
    formFields: [
      { 
        name: 'equipo', 
        label: 'Equipo', 
        type: 'select', 
        required: true,
        dataSource: 'equipos',
        valueField: 'id',
        labelField: 'nombre',
        customLabel: item => `${item.nombre} (${item.serie})`
      },
      { 
        name: 'usuario', 
        label: 'Usuario', 
        type: 'select', 
        required: true,
        dataSource: 'usuarios',
        valueField: 'id',
        labelField: 'nombre_completo'
      },
      { 
        name: 'asignado_por', 
        label: 'Asignado Por', 
        type: 'select', 
        required: true,
        dataSource: 'usuarios',
        valueField: 'id',
        labelField: 'nombre_completo',
        help: 'Usuario que realiza la asignación'
      },
      { name: 'fecha_asignacion', label: 'Fecha de Asignación', type: 'date', required: true },
      { name: 'fecha_devolucion', label: 'Fecha de Devolución', type: 'date', required: false },
      { name: 'motivo_asignacion', label: 'Motivo de Asignación', type: 'textarea', required: false, rows: 3 },
      { 
        name: 'estado_asignacion', 
        label: 'Estado', 
        type: 'select', 
        required: true,
        options: [
          { value: 'ACTIVA', label: 'Activa' },
          { value: 'FINALIZADA', label: 'Finalizada' }
        ]
      },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false, rows: 2 }
    ]
  },

  ubicaciones: {
    title: 'Ubicaciones',
    icon: 'fas fa-map-marker-alt',
    columns: [
      { field: 'codigo', label: 'Código', icon: 'fas fa-tag' },
      { field: 'nombre', label: 'Nombre', icon: 'fas fa-building' },
      { field: 'ciudad', label: 'Ciudad', icon: 'fas fa-city' },
      { field: 'estado', label: 'Estado', icon: 'fas fa-map' },
      { field: 'activo', label: 'Activo', icon: 'fas fa-check-circle', type: 'boolean' }
    ],
    formFields: [
      { name: 'codigo', label: 'Código', type: 'text', required: true, maxlength: 10 },
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, maxlength: 100 },
      { name: 'ciudad', label: 'Ciudad', type: 'text', required: true, maxlength: 50 },
      { name: 'estado', label: 'Estado', type: 'text', required: true, maxlength: 50 },
      { name: 'direccion', label: 'Dirección', type: 'text', maxlength: 255 },
      { 
        name: 'activo', 
        label: 'Activo', 
        type: 'select', 
        required: true,
        options: [
          { value: true, label: 'Sí' },
          { value: false, label: 'No' }
        ]
      }
    ]
  },
  mantenimientos: {
    title: 'Mantenimientos',
    icon: 'fas fa-wrench',
    columns: [
      { field: 'equipo_nombre', label: 'Equipo', icon: 'fas fa-desktop' },
      { field: 'fecha_inicio', label: 'Fecha Inicio', icon: 'fas fa-calendar', type: 'date' },
      { field: 'tipo', label: 'Tipo', icon: 'fas fa-cog', type: 'status' },
      { field: 'resultado', label: 'Resultado', icon: 'fas fa-check-circle', type: 'status' },
      { field: 'costo', label: 'Costo', icon: 'fas fa-dollar-sign', type: 'currency' }
    ],
    formFields: [
      { 
        name: 'equipo', 
        label: 'Equipo', 
        type: 'select', 
        required: true,
        dataSource: 'equipos',
        valueField: 'id',
        labelField: 'nombre',
        customLabel: item => `${item.nombre} (${item.serie})`
      },
      { name: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date', required: true },
      { name: 'fecha_fin', label: 'Fecha de Fin', type: 'date' },
      { 
        name: 'tipo', 
        label: 'Tipo', 
        type: 'select', 
        required: true, 
        options: [
          { value: 'PREVENTIVO', label: 'Preventivo' },
          { value: 'CORRECTIVO', label: 'Correctivo' }
        ]
      },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, rows: 3 },
      { name: 'responsable', label: 'Responsable', type: 'text', required: true },
      { name: 'costo', label: 'Costo', type: 'number', min: 0, step: 0.01 },
      { 
        name: 'resultado', 
        label: 'Resultado', 
        type: 'select', 
        required: true, 
        options: [
          { value: 'EXITOSO', label: 'Exitoso' },
          { value: 'PENDIENTE', label: 'Pendiente' },
          { value: 'FALLIDO', label: 'Fallido' }
        ]
      }
    ]
  },
  consumibles: {
    title: 'Consumibles',
    icon: 'fas fa-box',
    columns: [
      { field: 'tipo', label: 'Tipo', icon: 'fas fa-tag' },
      { field: 'modelo', label: 'Modelo', icon: 'fas fa-barcode' },
      { field: 'fabricante_nombre', label: 'Fabricante', icon: 'fas fa-industry' },
      { field: 'cantidad_disponible', label: 'Stock', icon: 'fas fa-cubes' },
      { field: 'ubicacion_nombre', label: 'Ubicación', icon: 'fas fa-map-marker-alt' },
      { field: 'costo_unitario', label: 'Costo', icon: 'fas fa-dollar-sign', type: 'currency' }
    ],
    formFields: [
      { name: 'tipo', label: 'Tipo', type: 'text', required: true, maxlength: 50 },
      { name: 'modelo', label: 'Modelo', type: 'text', required: true, maxlength: 50 },
      { 
        name: 'fabricante', 
        label: 'Fabricante', 
        type: 'select', 
        required: true,
        dataSource: 'fabricantes',
        valueField: 'id',
        labelField: 'nombre'
      },
      { 
        name: 'ubicacion', 
        label: 'Ubicación', 
        type: 'select', 
        required: true,
        dataSource: 'ubicaciones',
        valueField: 'id',
        labelField: 'nombre'
      },
      { name: 'compatibilidad', label: 'Compatibilidad', type: 'textarea', rows: 2 },
      { name: 'cantidad_disponible', label: 'Cantidad Disponible', type: 'number', required: true, min: 0 },
      { name: 'cantidad_minima', label: 'Cantidad Mínima', type: 'number', min: 0 },
      { name: 'costo_unitario', label: 'Costo Unitario', type: 'number', min: 0, step: 0.01 },
      { 
        name: 'activo', 
        label: 'Activo', 
        type: 'select', 
        required: true,
        options: [
          { value: true, label: 'Sí' },
          { value: false, label: 'No' }
        ]
      }
    ]
  }
};

// Funciones de utilidad para UI
function showLoading(show = true) {
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');
  
  if (show) {
    loading.style.display = 'block';
    content.style.display = 'none';
    AppState.isLoading = true;
  } else {
    loading.style.display = 'none';
    content.style.display = 'block';
    AppState.isLoading = false;
  }
}

function showAlert(message, type = 'info', container = 'content') {
  const alertHtml = UIComponents.createAlert(message, type, true);
  const targetContainer = document.getElementById(container);
  
  // Insertar al inicio del contenedor
  targetContainer.insertAdjacentHTML('afterbegin', alertHtml);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    const alert = targetContainer.querySelector('.alert');
    if (alert) {
      alert.remove();
    }
  }, 5000);
}

function updatePageTitle(title) {
  document.getElementById('page-title').textContent = title;
  document.title = `${title} - Sistema de Inventario`;
}

function updateAddButton(show = true, text = 'Agregar') {
  const addButton = document.getElementById('add-button');
  if (show) {
    addButton.style.display = 'block';
    addButton.innerHTML = `<i class="fas fa-plus me-2"></i>${text}`;
  } else {
    addButton.style.display = 'none';
  }
}
// Funciones para campos dependientes
window.loadModelos = async function(fabricanteId) {
  if (!fabricanteId) {
    // Limpiar modelos si no hay fabricante
    const modeloSelect = document.getElementById('modelo');
    if (modeloSelect) {
      modeloSelect.innerHTML = '<option value="">Seleccionar...</option>';
    }
    return;
  }

  try {
    const modelos = await ApiService.getModelosByFabricante(fabricanteId);
    const modeloSelect = document.getElementById('modelo');
    
    if (modeloSelect) {
      modeloSelect.innerHTML = '<option value="">Seleccionar...</option>';
      
      const modelosData = modelos.results || modelos;
      modelosData.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo.id;
        option.textContent = modelo.nombre;
        modeloSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading modelos:', error);
    showAlert('Error al cargar modelos', 'warning');
  }
};

// Cargar datos de referencia al inicializar
async function loadReferenceData() {
  try {
    if (Object.keys(AppState.referenceData).length === 0) {
      showLoading(true);
      AppState.referenceData = await ApiService.getReferenceData();
      console.log('Reference data loaded:', AppState.referenceData);
    }
  } catch (error) {
    console.error('Error loading reference data:', error);
    showAlert('Error al cargar datos de referencia', 'warning');
  } finally {
    showLoading(false);
  }
}
// Manejadores de módulos
const ModuleHandlers = {
  async dashboard() {
    updatePageTitle('Dashboard');
    updateAddButton(false);
    
    try {
      showLoading(true);
      
      // Obtener estadísticas (llamadas en paralelo)
      const [equipos, usuarios, asignaciones, mantenimientos] = await Promise.all([
        ApiService.getEquipos(),
        ApiService.getUsuarios(),
        ApiService.getAsignaciones(),
        ApiService.getMantenimientos()
      ]);

      const stats = [
        { 
          title: 'Total Equipos', 
          value: equipos.count || equipos.length || 0, 
          icon: 'fas fa-desktop', 
          color: 'primary' 
        },
        { 
          title: 'Usuarios Activos', 
          value: usuarios.results ? usuarios.results.filter(u => u.activo).length : usuarios.filter(u => u.activo).length || 0, 
          icon: 'fas fa-users', 
          color: 'success' 
        },
        { 
          title: 'Asignaciones Activas', 
          value: asignaciones.results ? asignaciones.results.filter(a => a.estado_asignacion === 'ACTIVA').length : asignaciones.filter(a => a.estado_asignacion === 'ACTIVA').length || 0, 
          icon: 'fas fa-handshake', 
          color: 'info' 
        },
        { 
          title: 'Mantenimientos', 
          value: mantenimientos.count || mantenimientos.length || 0, 
          icon: 'fas fa-wrench', 
          color: 'warning' 
        }
      ];

      let html = '<div class="row mb-4">';
      stats.forEach(stat => {
        html += UIComponents.createStatsCard(stat.title, stat.value, stat.icon, stat.color);
      });
      html += '</div>';

      // Agregar sección de acciones rápidas
      html += `
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0"><i class="fas fa-rocket me-2"></i>Acciones Rápidas</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <button class="btn btn-primary w-100" onclick="loadModule('equipos')">
                      <i class="fas fa-desktop mb-2 d-block" style="font-size: 2rem;"></i>
                      Gestionar Equipos
                    </button>
                  </div>
                  <div class="col-md-3 mb-3">
                    <button class="btn btn-success w-100" onclick="loadModule('usuarios')">
                      <i class="fas fa-users mb-2 d-block" style="font-size: 2rem;"></i>
                      Gestionar Usuarios
                    </button>
                  </div>
                  <div class="col-md-3 mb-3">
                    <button class="btn btn-info w-100" onclick="loadModule('asignaciones')">
                      <i class="fas fa-handshake mb-2 d-block" style="font-size: 2rem;"></i>
                      Nueva Asignación
                    </button>
                  </div>
                  <div class="col-md-3 mb-3">
                    <button class="btn btn-warning w-100" onclick="loadModule('mantenimientos')">
                      <i class="fas fa-wrench mb-2 d-block" style="font-size: 2rem;"></i>
                      Mantenimientos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('content').innerHTML = html;
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      document.getElementById('content').innerHTML = 
        UIComponents.createAlert('Error al cargar el dashboard: ' + error.message, 'danger');
    } finally {
      showLoading(false);
    }
  },

  async loadGenericModule(moduleName) {
    const config = ModuleConfig[moduleName];
    if (!config) {
      console.error(`Configuración no encontrada para módulo: ${moduleName}`);
      return;
    }

    updatePageTitle(config.title);
    updateAddButton(true, `Nuevo ${config.title.slice(0, -1)}`);
    
    try {
      showLoading(true);
      
      // Obtener datos del módulo
      let data;
      switch (moduleName) {
        case 'equipos':
          data = await ApiService.getEquipos();
          break;
        case 'usuarios':
          data = await ApiService.getUsuarios();
          break;
        case 'asignaciones':
          data = await ApiService.getAsignaciones();
          break;
        case 'ubicaciones':
          data = await ApiService.getUbicaciones();
          break;
        case 'mantenimientos':
          data = await ApiService.getMantenimientos();
          break;
        case 'consumibles':
          data = await ApiService.getConsumibles();
          break;
        default:
          throw new Error(`Módulo no implementado: ${moduleName}`);
      }

      // Guardar datos en el estado
      AppState.currentData = data.results || data;
      
      // Crear breadcrumb
      const breadcrumb = UIComponents.createBreadcrumb([
        { text: 'Dashboard', href: '#' },
        { text: config.title }
      ]);
      
      // Crear tabla
      const tableHtml = UIComponents.createTable(AppState.currentData, config.columns, {
        showActions: true,
        customActions: moduleName === 'asignaciones' ? [
                      { 
            icon: 'fas fa-stop-circle', 
            color: 'warning', 
            title: 'Finalizar',
            handler: 'finalizarAsignacion'
          }
        ] : []
      });

      // Construir HTML completo
      let html = breadcrumb;
      
      // Agregar filtros/búsqueda
      html += `
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-search"></i></span>
                  <input type="text" class="form-control" id="searchInput" placeholder="Buscar...">
                </div>
              </div>
              <div class="col-md-6 text-end">
                <button class="btn btn-outline-secondary me-2" onclick="exportData()">
                  <i class="fas fa-download me-1"></i>Exportar
                </button>
                <button class="btn btn-outline-primary" onclick="refreshData()">
                  <i class="fas fa-sync-alt me-1"></i>Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      html += tableHtml;
      
      document.getElementById('content').innerHTML = html;
      
      // Configurar búsqueda en tiempo real
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          filterTable(e.target.value);
        });
      }
      
    } catch (error) {
      console.error(`Error loading ${moduleName}:`, error);
      document.getElementById('content').innerHTML = 
        UIComponents.createAlert(`Error al cargar ${config.title.toLowerCase()}: ` + error.message, 'danger');
    } finally {
      showLoading(false);
    }
  },

  // Métodos específicos para cada módulo
  async equipos() {
    await this.loadGenericModule('equipos');
  },

  async usuarios() {
    await this.loadGenericModule('usuarios');
  },

  async asignaciones() {
    await this.loadGenericModule('asignaciones');
  },

  async ubicaciones() {
    await this.loadGenericModule('ubicaciones');
  },

  async mantenimientos() {
    await this.loadGenericModule('mantenimientos');
  },

  async consumibles() {
    await this.loadGenericModule('consumibles');
  }
};

// Funciones para manejar acciones de tabla
window.editItem = async function(id) {
  const config = ModuleConfig[AppState.currentModule];
  if (!config) return;

  AppState.modalMode = 'edit';
  
  try {
    // Encontrar el item en los datos actuales
    const item = AppState.currentData.find(i => i.id == id);
    if (!item) {
      showAlert('Elemento no encontrado', 'danger');
      return;
    }

    // Generar formulario con datos pre-cargados
    const formHtml = UIComponents.createForm(config.formFields, item);
    
    // Mostrar modal
    document.getElementById('modalTitle').textContent = `Editar ${config.title.slice(0, -1)}`;
    document.getElementById('modalBody').innerHTML = formHtml;
    document.getElementById('modalSaveBtn').onclick = () => saveItem(id);
    
    // Mostrar modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
    
  } catch (error) {
    console.error('Error editing item:', error);
    showAlert('Error al cargar datos para editar', 'danger');
  }
};

window.viewItem = async function(id) {
  const item = AppState.currentData.find(i => i.id == id);
  if (!item) {
    showAlert('Elemento no encontrado', 'danger');
    return;
  }

  const config = ModuleConfig[AppState.currentModule];
  
  // Crear vista detallada
  let html = '<div class="row">';
  
  Object.keys(item).forEach(key => {
    if (key !== 'id' && item[key] !== null && item[key] !== '') {
      html += `
        <div class="col-md-6 mb-3">
          <strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong><br>
          <span class="text-muted">${item[key]}</span>
        </div>
      `;
    }
  });
  
  html += '</div>';
  
  document.getElementById('modalTitle').textContent = `Detalle de ${config.title.slice(0, -1)}`;
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modalSaveBtn').style.display = 'none';
  
  const modal = new bootstrap.Modal(document.getElementById('formModal'));
  modal.show();
  
  // Restaurar botón al cerrar
  document.getElementById('formModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('modalSaveBtn').style.display = 'block';
  }, { once: true });
};

window.deleteItem = async function(id) {
  if (!confirm('¿Está seguro de que desea eliminar este elemento?')) {
    return;
  }

  try {
    showLoading(true);
    
    // Llamar API para eliminar
    switch (AppState.currentModule) {
      case 'equipos':
        await ApiService.deleteEquipo(id);
        break;
      case 'usuarios':
        await ApiService.deleteUsuario(id);
        break;
      default:
        throw new Error('Eliminación no implementada para este módulo');
    }
    
    showAlert('Elemento eliminado correctamente', 'success');
    
    // Recargar datos
    await ModuleHandlers[AppState.currentModule]();
    
  } catch (error) {
    console.error('Error deleting item:', error);
    showAlert('Error al eliminar: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
};

window.finalizarAsignacion = async function(id) {
  if (!confirm('¿Está seguro de que desea finalizar esta asignación?')) {
    return;
  }

  try {
    showLoading(true);
    
    const fechaDevolucion = prompt('Fecha de devolución (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!fechaDevolucion) return;
    
    await ApiService.finalizarAsignacion(id, {
      fecha_devolucion: fechaDevolucion
    });
    
    showAlert('Asignación finalizada correctamente', 'success');
    await ModuleHandlers.asignaciones();
    
  } catch (error) {
    console.error('Error finalizing assignment:', error);
    showAlert('Error al finalizar asignación: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
};

// Función para agregar nuevo elemento
// Función para agregar nuevo elemento (MEJORADA)
window.addNewItem = async function() {
  const config = ModuleConfig[AppState.currentModule];
  if (!config) return;

  AppState.modalMode = 'create';
  
  try {
    // Cargar datos de referencia si no están cargados
    await loadReferenceData();
    
    // Generar formulario vacío con datos de referencia
    const formHtml = UIComponents.createForm(config.formFields, {}, AppState.referenceData);
    
    document.getElementById('modalTitle').textContent = `Agregar ${config.title.slice(0, -1)}`;
    document.getElementById('modalBody').innerHTML = formHtml;
    document.getElementById('modalSaveBtn').onclick = () => saveItem();
    
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
    
  } catch (error) {
    console.error('Error opening add form:', error);
    showAlert('Error al abrir formulario', 'danger');
  }
};

// Función para editar elemento (MEJORADA)
window.editItem = async function(id) {
  const config = ModuleConfig[AppState.currentModule];
  if (!config) return;

  AppState.modalMode = 'edit';
  
  try {
    // Cargar datos de referencia si no están cargados
    await loadReferenceData();
    
    // Encontrar el item en los datos actuales
    const item = AppState.currentData.find(i => i.id == id);
    if (!item) {
      showAlert('Elemento no encontrado', 'danger');
      return;
    }

    // Generar formulario con datos pre-cargados
    const formHtml = UIComponents.createForm(config.formFields, item, AppState.referenceData);
    
    // Mostrar modal
    document.getElementById('modalTitle').textContent = `Editar ${config.title.slice(0, -1)}`;
    document.getElementById('modalBody').innerHTML = formHtml;
    document.getElementById('modalSaveBtn').onclick = () => saveItem(id);
    
    // Si es equipo y tiene fabricante, cargar modelos
    if (AppState.currentModule === 'equipos' && item.modelo) {
      // Buscar el fabricante del modelo actual
      const modeloActual = AppState.referenceData.modelos.find(m => m.id == item.modelo);
      if (modeloActual && modeloActual.fabricante) {
        await loadModelos(modeloActual.fabricante);
        // Reseleccionar el modelo actual
        const modeloSelect = document.getElementById('modelo');
        if (modeloSelect) {
          modeloSelect.value = item.modelo;
        }
      }
    }
    
    // Mostrar modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
    
  } catch (error) {
    console.error('Error editing item:', error);
    showAlert('Error al cargar datos para editar', 'danger');
  }
};

// Función para guardar elemento (crear o editar)
// Función para guardar elemento (MEJORADA con validación)
window.saveItem = async function(id = null) {
  const config = ModuleConfig[AppState.currentModule];
  if (!config) return;

  try {
    // Validar formulario
    if (!UIComponents.validateForm(config.formFields)) {
      showAlert('Por favor corrija los errores en el formulario', 'warning');
      return;
    }

    // Obtener datos del formulario
    const data = UIComponents.getFormData(config.formFields);
    
    console.log('Saving data:', data);
console.log('Module:', AppState.currentModule);
console.log('Mode:', AppState.modalMode);
console.log('Config fields:', config.formFields.map(f => f.name));
    
    showLoading(true);
    
    if (AppState.modalMode === 'create') {
      // Crear nuevo
      let response;
      switch (AppState.currentModule) {
        case 'equipos':
          response = await ApiService.createEquipo(data);
          break;
        case 'usuarios':
          response = await ApiService.createUsuario(data);
          break;
        case 'ubicaciones':
          response = await ApiService.createUbicacion(data);
          break;
        case 'asignaciones':
          response = await ApiService.createAsignacion(data);
          break;
        case 'mantenimientos':
          response = await ApiService.post('/mantenimientos/', data);
          break;
        case 'consumibles':
          response = await ApiService.post('/consumibles/', data);
          break;
        default:
          throw new Error('Creación no implementada para este módulo');
      }
      showAlert('Elemento creado correctamente', 'success');
    } else {
      // Editar existente
      let response;
      switch (AppState.currentModule) {
        case 'equipos':
          response = await ApiService.updateEquipo(id, data);
          break;
        case 'usuarios':
          response = await ApiService.updateUsuario(id, data);
          break;
        case 'ubicaciones':
          response = await ApiService.put(`/ubicaciones/${id}/`, data);
          break;
        case 'asignaciones':
          response = await ApiService.put(`/asignaciones/${id}/`, data);
          break;
        case 'mantenimientos':
          response = await ApiService.put(`/mantenimientos/${id}/`, data);
          break;
        case 'consumibles':
          response = await ApiService.put(`/consumibles/${id}/`, data);
          break;
        default:
          throw new Error('Edición no implementada para este módulo');
      }
      showAlert('Elemento actualizado correctamente', 'success');
    }
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
    if (modal) {
      modal.hide();
    }
    
    // Recargar datos
    await ModuleHandlers[AppState.currentModule]();
    
  } catch (error) {
    console.error('Error saving item:', error);
    
    // Manejar errores específicos de la API
    let errorMessage = 'Error al guardar';
    if (error.message.includes('400')) {
      errorMessage = 'Datos inválidos. Verifique la información ingresada.';
    } else if (error.message.includes('500')) {
      errorMessage = 'Error interno del servidor. Intente más tarde.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    
    showAlert(errorMessage, 'danger');
  } finally {
    showLoading(false);
  }
};

// Función para filtrar tabla
function filterTable(searchTerm) {
  const rows = document.querySelectorAll('#content table tbody tr');
  const term = searchTerm.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
}

// Función para exportar datos
window.exportData = function() {
  if (!AppState.currentData || AppState.currentData.length === 0) {
    showAlert('No hay datos para exportar', 'warning');
    return;
  }

  const config = ModuleConfig[AppState.currentModule];
  
  // Crear CSV
  let csv = config.columns.map(col => col.label).join(',') + '\n';
  
  AppState.currentData.forEach(item => {
    const row = config.columns.map(col => {
      const value = UIComponents.getNestedValue(item, col.field);
      return `"${value || ''}"`;
    }).join(',');
    csv += row + '\n';
  });
  
  // Descargar archivo
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${AppState.currentModule}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  showAlert('Datos exportados correctamente', 'success');
};

// Función para refrescar datos
window.refreshData = async function() {
  await ModuleHandlers[AppState.currentModule]();
  showAlert('Datos actualizados', 'info');
};

// Función principal para cargar módulos
window.loadModule = function(moduleName) {
  // Actualizar estado
  AppState.currentModule = moduleName;
  
  // Actualizar navegación activa
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`.sidebar .nav-link[onclick="loadModule('${moduleName}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Cargar módulo
  if (ModuleHandlers[moduleName]) {
    ModuleHandlers[moduleName]();
  } else {
    console.error(`Módulo no encontrado: ${moduleName}`);
    showAlert(`Módulo "${moduleName}" no encontrado`, 'danger');
  }
};

// Inicialización de la aplicación
// Inicialización de la aplicación (MEJORADA)
// Función para inicializar la aplicación principal
function initializeApp() {
  // Crear estructura HTML básica
  document.getElementById('app').innerHTML = `
    <div class="container-fluid p-0">
      <div class="row g-0">
        <!-- Sidebar -->
        <nav class="col-md-3 col-lg-2 d-md-block sidebar">
          <div class="position-sticky pt-3">
            <div class="text-center mb-4">
              <img src="/skytrack-logo.png" alt="Skytrack" style="width: 40px; height: 40px;">
            </div>
            
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" onclick="loadModule('dashboard')">
                  <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onclick="loadModule('equipos')">
                  <i class="fas fa-desktop"></i> Equipos
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onclick="loadModule('usuarios')">
                  <i class="fas fa-users"></i> Usuarios
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onclick="loadModule('asignaciones')">
                  <i class="fas fa-handshake"></i> Asignaciones
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onclick="loadModule('ubicaciones')">
                  <i class="fas fa-map-marker-alt"></i> Ubicaciones
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onclick="loadModule('mantenimientos')">
                  <i class="fas fa-wrench"></i> Mantenimientos
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onclick="loadModule('consumibles')">
                  <i class="fas fa-box"></i> Consumibles
                </a>
              </li>
            </ul>
            
            <!-- Botón de logout -->
            <div class="mt-auto p-3">
              <button class="btn btn-outline-light w-100" onclick="AuthService.logout()">
                <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>

        <!-- Main content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 content-area">
          <div class="content-header d-flex justify-content-between align-items-center">
            <h1 id="page-title">Dashboard</h1>
            <button type="button" class="btn btn-primary" id="add-button" style="display: none;" onclick="addNewItem()">
              <i class="fas fa-plus me-2"></i>Agregar
            </button>
          </div>

          <!-- Loading indicator -->
          <div id="loading" style="display: none;">
            ${UIComponents.createLoading()}
          </div>

          <!-- Content area -->
          <div id="content">
            <!-- Content will be loaded here -->
          </div>
        </main>
      </div>
    </div>

    <!-- Modal for forms -->
    <div class="modal fade" id="formModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Formulario</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="modalBody">
            <!-- Form content will be loaded here -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="modalSaveBtn">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Cargar Bootstrap JS si no está cargado
  if (!window.bootstrap) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    document.head.appendChild(script);
    script.onload = async function() {
      await loadReferenceData();
      loadModule('dashboard');
    };
  } else {
    loadReferenceData().then(() => {
      loadModule('dashboard');
    });
  }
}

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si está autenticado
  if (AuthService.isAuthenticated()) {
    initializeApp();
  } else {
    showLoginForm();
  }
});