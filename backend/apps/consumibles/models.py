from django.db import models
from apps.equipos.models import Equipo, Fabricante
from apps.ubicaciones.models import Ubicacion

class Consumible(models.Model):
    tipo = models.CharField(max_length=50, verbose_name="Tipo")
    modelo = models.CharField(max_length=50, verbose_name="Modelo")
    compatibilidad = models.TextField(blank=True, null=True, verbose_name="Compatibilidad")
    fabricante = models.ForeignKey(Fabricante, on_delete=models.PROTECT, verbose_name="Fabricante")
    cantidad_disponible = models.IntegerField(verbose_name="Cantidad Disponible")
    cantidad_minima = models.IntegerField(blank=True, null=True, verbose_name="Cantidad Mínima")
    costo_unitario = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Costo Unitario")
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, verbose_name="Ubicación")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Consumible"
        verbose_name_plural = "Consumibles"
        ordering = ['tipo', 'modelo']

    def __str__(self):
        return f"{self.tipo} - {self.modelo} ({self.fabricante})"

class ConsumibleEquipo(models.Model):
    consumible = models.ForeignKey(Consumible, on_delete=models.CASCADE, verbose_name="Consumible")
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, verbose_name="Equipo")
    cantidad_sugerida_mes = models.IntegerField(blank=True, null=True, verbose_name="Cantidad Sugerida por Mes")
    rendimiento_paginas = models.IntegerField(blank=True, null=True, verbose_name="Rendimiento en Páginas")

    class Meta:
        verbose_name = "Consumible por Equipo"
        verbose_name_plural = "Consumibles por Equipos"
        unique_together = ('consumible', 'equipo')

    def __str__(self):
        return f"{self.consumible} para {self.equipo}"

class ConsumoHistorico(models.Model):
    consumible = models.ForeignKey(Consumible, on_delete=models.PROTECT, verbose_name="Consumible")
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT, verbose_name="Equipo")
    fecha_consumo = models.DateField(verbose_name="Fecha de Consumo")
    cantidad = models.IntegerField(verbose_name="Cantidad")
    solicitado_por = models.CharField(max_length=100, blank=True, null=True, verbose_name="Solicitado Por")
    autorizado_por = models.CharField(max_length=100, blank=True, null=True, verbose_name="Autorizado Por")
    motivo = models.CharField(max_length=255, blank=True, null=True, verbose_name="Motivo")

    class Meta:
        verbose_name = "Consumo Histórico"
        verbose_name_plural = "Consumos Históricos"
        ordering = ['-fecha_consumo']

    def __str__(self):
        return f"{self.consumible} usado en {self.equipo} el {self.fecha_consumo}"