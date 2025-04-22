from django.db import models
from apps.ubicaciones.models import Ubicacion

class Area(models.Model):
    nombre = models.CharField(max_length=50, verbose_name="Nombre")
    descripcion = models.CharField(max_length=255, blank=True, null=True, verbose_name="Descripción")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Área"
        verbose_name_plural = "Áreas"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    nombre_usuario = models.CharField(max_length=50, verbose_name="Nombre de Usuario")
    nombre_completo = models.CharField(max_length=100, verbose_name="Nombre Completo")
    email = models.EmailField(max_length=100, blank=True, null=True, verbose_name="Email")
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    area = models.ForeignKey(Area, on_delete=models.PROTECT, verbose_name="Área")
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, verbose_name="Ubicación")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['nombre_completo']

    def __str__(self):
        return f"{self.nombre_usuario} - {self.nombre_completo}"