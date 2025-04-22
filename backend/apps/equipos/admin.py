from django.contrib import admin
from .models import CategoriaEquipo, Fabricante, Modelo, EstadoEquipo, Equipo

@admin.register(CategoriaEquipo)
class CategoriaEquipoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)

@admin.register(Fabricante)
class FabricanteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'contacto', 'telefono', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre', 'contacto')

@admin.register(Modelo)
class ModeloAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fabricante', 'categoria', 'tipo_componente', 'activo')
    list_filter = ('activo', 'fabricante', 'categoria')
    search_fields = ('nombre', 'fabricante__nombre')

@admin.register(EstadoEquipo)
class EstadoEquipoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'permite_asignacion')
    list_filter = ('permite_asignacion',)
    search_fields = ('nombre',)

@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'serie', 'modelo', 'estado', 'ubicacion', 'area')
    list_filter = ('estado', 'modelo', 'categoria', 'ubicacion', 'area')
    search_fields = ('nombre', 'serie', 'direccion_ip')
    date_hierarchy = 'fecha_compra'