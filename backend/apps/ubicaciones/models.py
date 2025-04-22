from django.db import models

class Ubicacion(models.Model):
    codigo = models.CharField(max_length=10, verbose_name="Código")
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    ciudad = models.CharField(max_length=50, verbose_name="Ciudad")
    estado = models.CharField(max_length=50, verbose_name="Estado")
    direccion = models.CharField(max_length=255, blank=True, null=True, verbose_name="Dirección")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Ubicación"
        verbose_name_plural = "Ubicaciones"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"