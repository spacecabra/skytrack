from django.contrib import admin
from .models import Consumible, ConsumibleEquipo, ConsumoHistorico

@admin.register(Consumible)
class ConsumibleAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'modelo', 'fabricante', 'cantidad_disponible', 'ubicacion', 'activo')
    list_filter = ('activo', 'tipo', 'fabricante', 'ubicacion')
    search_fields = ('tipo', 'modelo', 'fabricante__nombre')

@admin.register(ConsumibleEquipo)
class ConsumibleEquipoAdmin(admin.ModelAdmin):
    list_display = ('consumible', 'equipo', 'cantidad_sugerida_mes', 'rendimiento_paginas')
    list_filter = ('consumible__tipo', 'equipo__categoria')
    search_fields = ('consumible__modelo', 'equipo__nombre', 'equipo__serie')

@admin.register(ConsumoHistorico)
class ConsumoHistoricoAdmin(admin.ModelAdmin):
    list_display = ('consumible', 'equipo', 'fecha_consumo', 'cantidad', 'solicitado_por')
    list_filter = ('fecha_consumo', 'consumible__tipo')
    search_fields = ('consumible__modelo', 'equipo__nombre', 'solicitado_por')
    date_hierarchy = 'fecha_consumo'