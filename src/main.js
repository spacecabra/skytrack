import './style.css'

// Configuración de la API
const API_BASE = 'http://127.0.0.1:8000/api/v1';

// Estado global de autenticación
let currentUser = null;
let authToken = null;

// Verificar si hay token guardado
function initializeAuth() {
  const savedToken = localStorage.getItem('auth_token');
  const savedUser = localStorage.getItem('user_data');
  
  if (savedToken && savedUser) {
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    return true;
  }
  return false;
}

// Función para hacer requests a la API con autenticación
async function apiRequest(endpoint, options = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Agregar token si existe
    if (authToken) {
      headers['Authorization'] = `Token ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers,
      ...options,
    });
    
    if (response.status === 401) {
      // Token expirado o inválido
      logout();
      showLogin();
      throw new Error('Sesión expirada');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Función de login
async function login(username, password) {
  try {
    console.log('Iniciando login...');
    
    const response = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    console.log('Login exitoso:', response);
    
    // Guardar datos de autenticación
    authToken = response.token;
    currentUser = {
      id: response.user_id,
      username: response.username,
      email: response.email,
      is_staff: response.is_staff
    };
    
    // Guardar en localStorage
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(currentUser));
    
    console.log('Datos guardados, mostrando dashboard...');
    
    // Cambiar a layout principal y mostrar dashboard
    document.querySelector('#app').innerHTML = createMainLayout();
    await showDashboard();
    
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

// Función de logout
function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
}

// Crear formulario de login
function createLoginForm() {
  return `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🚀 SkyTrack</h1>
          <h2>Sistema de Inventario</h2>
          <p>Inicia sesión para continuar</p>
        </div>
        
        <form id="login-form" class="login-form">
          <div class="form-group">
            <label for="username">👤 Usuario</label>
            <input type="text" id="username" name="username" required placeholder="Ingresa tu usuario">
          </div>
          
          <div class="form-group">
            <label for="password">🔒 Contraseña</label>
            <input type="password" id="password" name="password" required placeholder="Ingresa tu contraseña">
          </div>
          
          <button type="submit" class="btn btn-primary btn-login">
            <span id="login-text">Iniciar Sesión</span>
            <span id="login-loading" style="display: none;">⏳ Iniciando...</span>
          </button>
          
          <div id="login-error" class="error-message" style="display: none;"></div>
        </form>
        
        <div class="login-footer">
          <p>💡 <strong>Tip:</strong> Usa las credenciales que creaste con <code>createsuperuser</code></p>
        </div>
      </div>
    </div>
  `;
}

// Crear layout principal de la aplicación
function createMainLayout() {
  return `
    <div class="container">
      <nav class="navbar">
        <h1>🚀 SkyTrack - Sistema de Inventario</h1>
        <div class="nav-buttons">
          <span class="user-info">👤 ${currentUser?.username || 'Usuario'}</span>
          <button onclick="showDashboard()" class="btn btn-primary">Dashboard</button>
          <button onclick="showEquipos()" class="btn btn-secondary">Equipos</button>
          <button onclick="showNuevoEquipo()" class="btn btn-success">+ Nuevo Equipo</button>
          <button onclick="handleLogout()" class="btn btn-danger">Cerrar Sesión</button>
        </div>
      </nav>

      <div id="content">
        <!-- Contenido dinámico -->
      </div>
    </div>
  `;
}

// Función para mostrar login
function showLogin() {
  document.querySelector('#app').innerHTML = createLoginForm();
  
  // Agregar event listener al formulario
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    const loginText = document.getElementById('login-text');
    const loginLoading = document.getElementById('login-loading');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Mostrar loading
    loginText.style.display = 'none';
    loginLoading.style.display = 'inline';
    errorDiv.style.display = 'none';
    submitButton.disabled = true;
    
    try {
      await login(username, password);
      console.log('Login completado exitosamente');
    } catch (error) {
      console.error('Error en login:', error);
      
      // Mostrar error
      let errorMessage = 'Error al iniciar sesión';
      if (error.message.includes('401')) {
        errorMessage = 'Usuario o contraseña incorrectos';
      } else if (error.message.includes('403')) {
        errorMessage = 'Error de configuración del servidor';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'block';
      
      // Restaurar botón
      loginText.style.display = 'inline';
      loginLoading.style.display = 'none';
      submitButton.disabled = false;
    }
  });
}

// Funciones de navegación (copiadas del código anterior)
window.showDashboard = async function() {
  if (!authToken) {
    showLogin();
    return;
  }
  
  document.getElementById('content').innerHTML = `
    <div class="dashboard">
      <h2>📊 Dashboard</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3 id="total-equipos">⏳</h3>
          <p>Total Equipos</p>
        </div>
        <div class="stat-card">
          <h3 id="total-usuarios">⏳</h3>
          <p>Usuarios</p>
        </div>
        <div class="stat-card">
          <h3 id="total-ubicaciones">⏳</h3>
          <p>Ubicaciones</p>
        </div>
        <div class="stat-card">
          <h3 id="equipos-activos">⏳</h3>
          <p>Equipos Activos</p>
        </div>
      </div>
      
      <div class="recent-section">
        <h3>📋 Equipos Recientes</h3>
        <div id="recent-equipos">⏳ Cargando...</div>
      </div>
    </div>
  `;
  await loadDashboardStats();
};

window.showEquipos = async function() {
  if (!authToken) {
    showLogin();
    return;
  }
  
  try {
    document.getElementById('content').innerHTML = '<div class="loading">⏳ Cargando equipos...</div>';
    
    const equipos = await apiRequest('/equipos/');
    const equiposData = equipos.results || (Array.isArray(equipos) ? equipos : []);
    
    document.getElementById('content').innerHTML = createEquiposList(equiposData);
  } catch (error) {
    document.getElementById('content').innerHTML = `
      <div class="error">
        <h3>❌ Error al cargar equipos</h3>
        <p>${error.message}</p>
        <button onclick="showEquipos()" class="btn btn-primary">🔄 Reintentar</button>
      </div>
    `;
  }
};

window.showNuevoEquipo = function() {
  document.getElementById('content').innerHTML = `
    <div class="form-section">
      <div class="form-header">
        <h2>➕ Nuevo Equipo</h2>
        <button onclick="showEquipos()" class="btn btn-secondary">← Volver a Equipos</button>
      </div>
      
      <div class="coming-soon">
        <h3>🚧 Formulario en desarrollo</h3>
        <p>Esta funcionalidad estará disponible pronto.</p>
        <p>Por ahora, puedes agregar equipos desde el panel de administración:</p>
        <a href="http://127.0.0.1:8000/admin/" target="_blank" class="btn btn-primary">
          🔗 Ir al Panel Admin
        </a>
      </div>
    </div>
  `;
};

window.handleLogout = async function() {
  try {
    if (authToken) {
      await apiRequest('/auth/logout/', { method: 'POST' });
    }
  } catch (error) {
    console.error('Error durante logout:', error);
  }
  
  logout();
  showLogin();
};

// Cargar estadísticas del dashboard (función existente)
async function loadDashboardStats() {
  try {
    const [equipos, usuarios, ubicaciones] = await Promise.all([
      apiRequest('/equipos/'),
      apiRequest('/usuarios/'),
      apiRequest('/ubicaciones/')
    ]);

    const totalEquipos = equipos.count || (equipos.results ? equipos.results.length : (Array.isArray(equipos) ? equipos.length : 0));
    const totalUsuarios = usuarios.count || (usuarios.results ? usuarios.results.length : (Array.isArray(usuarios) ? usuarios.length : 0));
    const totalUbicaciones = ubicaciones.count || (ubicaciones.results ? ubicaciones.results.length : (Array.isArray(ubicaciones) ? ubicaciones.length : 0));

    document.getElementById('total-equipos').textContent = totalEquipos;
    document.getElementById('total-usuarios').textContent = totalUsuarios;
    document.getElementById('total-ubicaciones').textContent = totalUbicaciones;
    
    const equiposData = equipos.results || (Array.isArray(equipos) ? equipos : []);
    const equiposActivos = equiposData.filter(e => e.estado === 1).length;
    document.getElementById('equipos-activos').textContent = equiposActivos;

    const recentEquipos = equiposData.slice(0, 5);
    let recentHtml = '';
    
    if (recentEquipos.length > 0) {
      recentHtml = recentEquipos.map(equipo => `
        <div class="recent-item" onclick="showEquipoDetail(${equipo.id})">
          <span class="recent-name">${equipo.nombre || 'Sin nombre'}</span>
          <span class="recent-model">${equipo.modelo_nombre || equipo.serie || 'N/A'}</span>
        </div>
      `).join('');
    } else {
      recentHtml = '<p>No hay equipos registrados</p>';
    }
    
    document.getElementById('recent-equipos').innerHTML = recentHtml;
    
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    document.getElementById('total-equipos').textContent = 'Error';
    document.getElementById('total-usuarios').textContent = 'Error';
    document.getElementById('total-ubicaciones').textContent = 'Error';
    document.getElementById('equipos-activos').textContent = 'Error';
  }
}

// Crear lista de equipos (función existente)
function createEquiposList(equipos) {
  if (!equipos || equipos.length === 0) {
    return `
      <div class="equipos-section">
        <div class="section-header">
          <h2>💻 Equipos</h2>
          <button onclick="showNuevoEquipo()" class="btn btn-success">+ Nuevo Equipo</button>
        </div>
        <div class="empty-state">
          <h3>📦 No hay equipos registrados</h3>
          <p>Comienza agregando tu primer equipo</p>
          <button onclick="showNuevoEquipo()" class="btn btn-primary">+ Agregar Equipo</button>
        </div>
      </div>
    `;
  }

  const equiposHtml = equipos.map(equipo => {
    const esActivo = equipo.estado === 1;
    const badgeClass = esActivo ? 'badge-success' : 'badge-warning';
    const estadoTexto = esActivo ? 'ACTIVO' : 'INACTIVO';
    
    return `
      <div class="equipo-card" onclick="showEquipoDetail(${equipo.id})">
        <div class="equipo-header">
          <h4>${equipo.nombre || 'Sin nombre'}</h4>
          <span class="badge ${badgeClass}">
            ${estadoTexto}
          </span>
        </div>
        <div class="equipo-info">
          <p><strong>Serie:</strong> ${equipo.serie || 'N/A'}</p>
          <p><strong>Modelo:</strong> ${equipo.modelo_nombre || 'N/A'}</p>
          <p><strong>Ubicación:</strong> ${equipo.ubicacion_nombre || 'N/A'}</p>
          <p><strong>SO:</strong> ${equipo.sistema_operativo || 'N/A'}</p>
          <p><strong>RAM:</strong> ${equipo.memoria_ram || 'N/A'}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="equipos-section">
      <div class="section-header">
        <h2>💻 Equipos (${equipos.length})</h2>
        <button onclick="showNuevoEquipo()" class="btn btn-success">+ Nuevo Equipo</button>
      </div>
      
      <div class="equipos-grid">
        ${equiposHtml}
      </div>
    </div>
  `;
}

window.showEquipoDetail = async function(id) {
  if (!authToken) {
    showLogin();
    return;
  }
  
  try {
    document.getElementById('content').innerHTML = '<div class="loading">⏳ Cargando detalle...</div>';
    
    const equipo = await apiRequest(`/equipos/${id}/`);
    
    document.getElementById('content').innerHTML = `
      <div class="equipo-detail">
        <div class="detail-header">
          <h2>🔍 ${equipo.nombre || 'Equipo sin nombre'}</h2>
          <button onclick="showEquipos()" class="btn btn-secondary">← Volver a Equipos</button>
        </div>
        
        <div class="detail-grid">
          <div class="detail-card">
            <h3>📋 Información General</h3>
            <p><strong>Serie:</strong> ${equipo.serie || 'N/A'}</p>
            <p><strong>Estado:</strong> ${equipo.estado === 1 ? '✅ ACTIVO' : '⚠️ INACTIVO'}</p>
            <p><strong>Fecha Compra:</strong> ${equipo.fecha_compra || 'N/A'}</p>
            <p><strong>Garantía hasta:</strong> ${equipo.fecha_fin_garantia || 'N/A'}</p>
          </div>
          
          <div class="detail-card">
            <h3>💻 Especificaciones</h3>
            <p><strong>SO:</strong> ${equipo.sistema_operativo || 'N/A'}</p>
            <p><strong>Procesador:</strong> ${equipo.procesador || 'N/A'}</p>
            <p><strong>RAM:</strong> ${equipo.memoria_ram || 'N/A'}</p>
            <p><strong>Disco:</strong> ${equipo.disco_duro || 'N/A'}</p>
          </div>
          
          <div class="detail-card">
            <h3>📍 Ubicación</h3>
            <p><strong>Ubicación:</strong> ${equipo.ubicacion_nombre || 'N/A'}</p>
            <p><strong>Área:</strong> ${equipo.area_nombre || 'N/A'}</p>
            <p><strong>IP:</strong> ${equipo.direccion_ip || 'N/A'}</p>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    document.getElementById('content').innerHTML = `
      <div class="error">
        <h3>❌ Error al cargar equipo</h3>
        <p>${error.message}</p>
        <button onclick="showEquipos()" class="btn btn-secondary">← Volver a Equipos</button>
      </div>
    `;
  }
};

// Inicializar la aplicación
function initializeApp() {
  if (initializeAuth()) {
    // Usuario ya logueado
    document.querySelector('#app').innerHTML = createMainLayout();
    showDashboard();
  } else {
    // Mostrar login
    showLogin();
  }
}

// Inicializar cuando se carga la página
initializeApp();