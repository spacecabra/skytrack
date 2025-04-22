from django.db import models
from apps.equipos.models import Equipo

class Mantenimiento(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT, verbose_name="Equipo")
    fecha_inicio = models.DateField(verbose_name="Fecha de Inicio")
    fecha_fin = models.DateField(blank=True, null=True, verbose_name="Fecha de Finalización")
    tipo = models.CharField(max_length=20, choices=[
        ('PREVENTIVO', 'Preventivo'),
        ('CORRECTIVO', 'Correctivo')
    ], verbose_name="Tipo")
    descripcion = models.TextField(verbose_name="Descripción")
    responsable = models.CharField(max_length=100, verbose_name="Responsable")
    costo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Costo")
    resultado = models.CharField(max_length=20, choices=[
        ('EXITOSO', 'Exitoso'),
        ('PENDIENTE', 'Pendiente'),
        ('FALLIDO', 'Fallido')
    ], verbose_name="Resultado")

    class Meta:
        verbose_name = "Mantenimiento"
        verbose_name_plural = "Mantenimientos"
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f"Mantenimiento de {self.equipo} - {self.fecha_inicio} - {self.tipo}"

class Garantia(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT, verbose_name="Equipo")
    fecha_inicio = models.DateField(verbose_name="Fecha de Inicio")
    fecha_fin = models.DateField(verbose_name="Fecha de Finalización")
    proveedor = models.CharField(max_length=100, verbose_name="Proveedor")
    condiciones = models.TextField(blank=True, null=True, verbose_name="Condiciones")
    documento_referencia = models.CharField(max_length=100, blank=True, null=True, verbose_name="Documento de Referencia")
    activa = models.BooleanField(default=True, verbose_name="Activa")

    class Meta:
        verbose_name = "Garantía"
        verbose_name_plural = "Garantías"
        ordering = ['-fecha_fin']

    def __str__(self):
        return f"Garantía de {self.equipo} - vence: {self.fecha_fin}"