from django.contrib import admin
from .models import Area, Usuario

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nombre_usuario', 'nombre_completo', 'email', 'area', 'ubicacion', 'activo')
    list_filter = ('activo', 'area', 'ubicacion')
    search_fields = ('nombre_usuario', 'nombre_completo', 'email')