from django.contrib import admin
from .models import AsignacionEquipo, HistorialUbicacion, ConexionRed

@admin.register(AsignacionEquipo)
class AsignacionEquipoAdmin(admin.ModelAdmin):
    list_display = ('equipo', 'usuario', 'fecha_asignacion', 'fecha_devolucion', 'estado_asignacion')
    list_filter = ('estado_asignacion', 'fecha_asignacion')
    search_fields = ('equipo__nombre', 'equipo__serie', 'usuario__nombre_completo')
    date_hierarchy = 'fecha_asignacion'

@admin.register(HistorialUbicacion)
class HistorialUbicacionAdmin(admin.ModelAdmin):
    list_display = ('equipo', 'ubicacion_anterior', 'ubicacion_nueva', 'fecha_cambio')
    list_filter = ('fecha_cambio', 'ubicacion_anterior', 'ubicacion_nueva')
    search_fields = ('equipo__nombre', 'equipo__serie', 'motivo')
    date_hierarchy = 'fecha_cambio'

@admin.register(ConexionRed)
class ConexionRedAdmin(admin.ModelAdmin):
    list_display = ('equipo', 'tipo_conexion', 'ip_privada', 'ip_publica', 'activo')
    list_filter = ('activo', 'tipo_conexion')
    search_fields = ('equipo__nombre', 'ip_privada', 'ip_publica')