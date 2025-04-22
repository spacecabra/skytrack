from django.contrib import admin
from .models import Ubicacion

@admin.register(Ubicacion)
class UbicacionAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre', 'ciudad', 'estado', 'activo')
    list_filter = ('activo', 'ciudad', 'estado')
    search_fields = ('codigo', 'nombre', 'ciudad')