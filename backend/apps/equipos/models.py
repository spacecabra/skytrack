from django.db import models
from apps.ubicaciones.models import Ubicacion
from apps.usuarios.models import Area

class CategoriaEquipo(models.Model):
    nombre = models.CharField(max_length=50, verbose_name="Nombre")
    descripcion = models.CharField(max_length=255, blank=True, null=True, verbose_name="Descripción")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Categoría de Equipo"
        verbose_name_plural = "Categorías de Equipos"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Fabricante(models.Model):
    nombre = models.CharField(max_length=50, verbose_name="Nombre")
    contacto = models.CharField(max_length=100, blank=True, null=True, verbose_name="Contacto")
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    sitio_web = models.CharField(max_length=100, blank=True, null=True, verbose_name="Sitio Web")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Fabricante"
        verbose_name_plural = "Fabricantes"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Modelo(models.Model):
    nombre = models.CharField(max_length=50, verbose_name="Nombre")
    fabricante = models.ForeignKey(Fabricante, on_delete=models.PROTECT, verbose_name="Fabricante")
    categoria = models.ForeignKey(CategoriaEquipo, on_delete=models.PROTECT, verbose_name="Categoría")
    tipo_componente = models.CharField(max_length=50, blank=True, null=True, verbose_name="Tipo de Componente")
    especificaciones = models.TextField(blank=True, null=True, verbose_name="Especificaciones")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Modelo"
        verbose_name_plural = "Modelos"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.fabricante.nombre} {self.nombre}"

class EstadoEquipo(models.Model):
    nombre = models.CharField(max_length=30, verbose_name="Nombre")
    descripcion = models.CharField(max_length=255, blank=True, null=True, verbose_name="Descripción")
    permite_asignacion = models.BooleanField(default=True, verbose_name="Permite Asignación")

    class Meta:
        verbose_name = "Estado de Equipo"
        verbose_name_plural = "Estados de Equipos"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Equipo(models.Model):
    nombre = models.CharField(max_length=50, verbose_name="Nombre")
    serie = models.CharField(max_length=50, unique=True, verbose_name="Número de Serie")
    sistema_operativo = models.CharField(max_length=50, blank=True, null=True, verbose_name="Sistema Operativo")
    procesador = models.CharField(max_length=50, blank=True, null=True, verbose_name="Procesador")
    memoria_ram = models.CharField(max_length=20, blank=True, null=True, verbose_name="Memoria RAM")
    disco_duro = models.CharField(max_length=50, blank=True, null=True, verbose_name="Disco Duro")
    direccion_ip = models.CharField(max_length=20, blank=True, null=True, verbose_name="Dirección IP")
    fecha_compra = models.DateField(blank=True, null=True, verbose_name="Fecha de Compra")
    fecha_fin_garantia = models.DateField(blank=True, null=True, verbose_name="Fecha Fin de Garantía")
    estado = models.ForeignKey(EstadoEquipo, on_delete=models.PROTECT, verbose_name="Estado")
    modelo = models.ForeignKey(Modelo, on_delete=models.PROTECT, verbose_name="Modelo")
    categoria = models.ForeignKey(CategoriaEquipo, on_delete=models.PROTECT, verbose_name="Categoría")
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, verbose_name="Ubicación")
    area = models.ForeignKey(Area, on_delete=models.PROTECT, verbose_name="Área")
    observaciones = models.TextField(blank=True, null=True, verbose_name="Observaciones")

    class Meta:
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.serie}"