from django.contrib import admin
from .models import Mantenimiento, Garantia

@admin.register(Mantenimiento)
class MantenimientoAdmin(admin.ModelAdmin):
    list_display = ('equipo', 'fecha_inicio', 'fecha_fin', 'tipo', 'resultado')
    list_filter = ('tipo', 'resultado', 'fecha_inicio')
    search_fields = ('equipo__nombre', 'equipo__serie', 'descripcion')
    date_hierarchy = 'fecha_inicio'

@admin.register(Garantia)
class GarantiaAdmin(admin.ModelAdmin):
    list_display = ('equipo', 'fecha_inicio', 'fecha_fin', 'proveedor', 'activa')
    list_filter = ('activa', 'fecha_fin')
    search_fields = ('equipo__nombre', 'equipo__serie', 'proveedor')
    date_hierarchy = 'fecha_fin'