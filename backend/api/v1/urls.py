from django.urls import path, include
from rest_framework import routers

# Importa los viewsets de cada aplicación
from api.v1.views.core import AsignacionEquipoViewSet, HistorialUbicacionViewSet, ConexionRedViewSet
from api.v1.views.ubicaciones import UbicacionViewSet
from api.v1.views.usuarios import AreaViewSet, UsuarioViewSet
from api.v1.views.equipos import CategoriaEquipoViewSet, FabricanteViewSet, ModeloViewSet, EstadoEquipoViewSet, EquipoViewSet
from api.v1.views.mantenimientos import MantenimientoViewSet, GarantiaViewSet
from api.v1.views.consumibles import ConsumibleViewSet, ConsumibleEquipoViewSet, ConsumoHistoricoViewSet

# AGREGAR ESTE IMPORT ← IMPORTANTE
from api.v1.views.auth import login, logout, user_info, register

# Crea un router principal
router = routers.DefaultRouter()

# Core
router.register('asignaciones', AsignacionEquipoViewSet)
router.register('historial-ubicaciones', HistorialUbicacionViewSet)
router.register('conexiones-red', ConexionRedViewSet)

# Ubicaciones
router.register('ubicaciones', UbicacionViewSet)

# Usuarios
router.register('areas', AreaViewSet)
router.register('usuarios', UsuarioViewSet)

# Equipos
router.register('categorias', CategoriaEquipoViewSet)
router.register('fabricantes', FabricanteViewSet)
router.register('modelos', ModeloViewSet)
router.register('estados', EstadoEquipoViewSet)
router.register('equipos', EquipoViewSet)

# Mantenimientos
router.register('mantenimientos', MantenimientoViewSet)
router.register('garantias', GarantiaViewSet)

# Consumibles
router.register('consumibles', ConsumibleViewSet)
router.register('consumibles-equipo', ConsumibleEquipoViewSet)
router.register('consumos', ConsumoHistoricoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # AGREGAR ESTAS LÍNEAS ← IMPORTANTE
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/user/', user_info, name='user_info'),
    path('auth/register/', register, name='register'),
    
    path('auth/', include('rest_framework.urls')),  # URLs de autenticación básica de DRF
]