// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Clase para manejar todas las llamadas a la API
class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` })
      },
      ...options
    };

    try {
      console.log('Making request to:', url);
      console.log('With config:', config);
      
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      
      // Si es 401, redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
        return;
      }
      
      if (!response.ok) {
        // Intentar leer el error del servidor
        let errorDetails = '';
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorDetails = JSON.stringify(errorData, null, 2);
        } catch (e) {
          errorDetails = await response.text();
          console.log('Error response text:', errorDetails);
        }
        
        throw new Error(`HTTP ${response.status}: ${errorDetails}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos HTTP básicos
  static async get(endpoint) {
    return ApiService.request(endpoint);
  }

  static async post(endpoint, data) {
    return ApiService.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async put(endpoint, data) {
    return ApiService.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(endpoint) {
    return ApiService.request(endpoint, {
      method: 'DELETE'
    });
  }

  // Métodos específicos para cada módulo
  static async getEquipos() {
    return ApiService.get('/equipos/');
  }

  static async getUsuarios() {
    return ApiService.get('/usuarios/');
  }

  static async getAsignaciones() {
    return ApiService.get('/asignaciones/');
  }

  static async getUbicaciones() {
    return ApiService.get('/ubicaciones/');
  }

  static async getMantenimientos() {
    return ApiService.get('/mantenimientos/');
  }

  static async getConsumibles() {
    return ApiService.get('/consumibles/');
  }

  static async getAreas() {
    return ApiService.get('/areas/');
  }

  static async getCategorias() {
    return ApiService.get('/categorias/');
  }

  static async getFabricantes() {
    return ApiService.get('/fabricantes/');
  }

  static async getModelos() {
    return ApiService.get('/modelos/');
  }

  static async getEstados() {
    return ApiService.get('/estados/');
  }

  // Métodos para crear nuevos registros
  static async createEquipo(data) {
    return ApiService.post('/equipos/', data);
  }

  static async createUsuario(data) {
    return ApiService.post('/usuarios/', data);
  }

  static async createAsignacion(data) {
    return ApiService.post('/asignaciones/', data);
  }

  static async createUbicacion(data) {
    return ApiService.post('/ubicaciones/', data);
  }

  // Métodos para actualizar
  static async updateEquipo(id, data) {
    return ApiService.put(`/equipos/${id}/`, data);
  }

  static async updateUsuario(id, data) {
    return ApiService.put(`/usuarios/${id}/`, data);
  }

  // Métodos para eliminar
  static async deleteEquipo(id) {
    return ApiService.delete(`/equipos/${id}/`);
  }

  static async deleteUsuario(id) {
    return ApiService.delete(`/usuarios/${id}/`);
  }

  // Métodos especiales de la API
  static async getEquiposDisponibles() {
    return ApiService.get('/equipos/disponibles/');
  }

  static async getAsignacionesActivas() {
    return ApiService.get('/asignaciones/activas/');
  }

  static async getMantenimientosPendientes() {
    return ApiService.get('/mantenimientos/pendientes/');
  }

  static async getGarantiasPorVencer() {
    return ApiService.get('/garantias/por_vencer/');
  }

  static async getConsumiblesStockBajo() {
    return ApiService.get('/consumibles/stock_bajo/');
  }

  static async finalizarAsignacion(id, data) {
    return ApiService.post(`/asignaciones/${id}/finalizar/`, data);
  }

  // Métodos para obtener datos de referencia (para formularios)
  static async getReferenceData() {
    try {
      const [areas, ubicaciones, categorias, fabricantes, modelos, estados, usuarios, equipos] = await Promise.all([
        ApiService.getAreas(),
        ApiService.getUbicaciones(), 
        ApiService.getCategorias(),
        ApiService.getFabricantes(),
        ApiService.getModelos(),
        ApiService.getEstados(),
        ApiService.getUsuarios(),
        ApiService.getEquipos()
      ]);

      return {
        areas: areas.results || areas,
        ubicaciones: ubicaciones.results || ubicaciones,
        categorias: categorias.results || categorias,
        fabricantes: fabricantes.results || fabricantes,
        modelos: modelos.results || modelos,
        estados: estados.results || estados,
        usuarios: usuarios.results || usuarios,
        equipos: equipos.results || equipos
      };
    } catch (error) {
      console.error('Error loading reference data:', error);
      return {
        areas: [],
        ubicaciones: [],
        categorias: [],
        fabricantes: [],
        modelos: [],
        estados: [],
        usuarios: [],
        equipos: []
      };
    }
  }

  // Obtener modelos por fabricante
  static async getModelosByFabricante(fabricanteId) {
    return ApiService.get(`/modelos/?fabricante=${fabricanteId}`);
  }

  // Obtener equipos disponibles para asignación
  static async getEquiposParaAsignacion() {
    return ApiService.get('/equipos/disponibles/');
  }
}

export default ApiService;