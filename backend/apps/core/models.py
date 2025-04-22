from django.db import models
from apps.equipos.models import Equipo
from apps.usuarios.models import Usuario
from apps.ubicaciones.models import Ubicacion

class AsignacionEquipo(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT, verbose_name="Equipo")
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, verbose_name="Usuario")
    fecha_asignacion = models.DateField(verbose_name="Fecha de Asignación")
    fecha_devolucion = models.DateField(blank=True, null=True, verbose_name="Fecha de Devolución")
    motivo_asignacion = models.CharField(max_length=255, blank=True, null=True, verbose_name="Motivo de Asignación")
    estado_asignacion = models.CharField(max_length=20, choices=[
        ('ACTIVA', 'Activa'),
        ('FINALIZADA', 'Finalizada')
    ], default='ACTIVA', verbose_name="Estado")
    asignado_por = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='asignaciones_realizadas', verbose_name="Asignado Por")
    observaciones = models.TextField(blank=True, null=True, verbose_name="Observaciones")

    class Meta:
        verbose_name = "Asignación de Equipo"
        verbose_name_plural = "Asignaciones de Equipos"
        ordering = ['-fecha_asignacion']

    def __str__(self):
        return f"{self.equipo} asignado a {self.usuario} el {self.fecha_asignacion}"

class HistorialUbicacion(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.PROTECT, verbose_name="Equipo")
    ubicacion_anterior = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, related_name='historiales_como_origen', verbose_name="Ubicación Anterior")
    ubicacion_nueva = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, related_name='historiales_como_destino', verbose_name="Ubicación Nueva")
    fecha_cambio = models.DateField(verbose_name="Fecha de Cambio")
    motivo = models.CharField(max_length=255, blank=True, null=True, verbose_name="Motivo")
    registrado_por = models.ForeignKey(Usuario, on_delete=models.PROTECT, verbose_name="Registrado Por")

    class Meta:
        verbose_name = "Historial de Ubicación"
        verbose_name_plural = "Historiales de Ubicaciones"
        ordering = ['-fecha_cambio']

    def __str__(self):
        return f"{self.equipo} trasladado de {self.ubicacion_anterior} a {self.ubicacion_nueva} el {self.fecha_cambio}"

class ConexionRed(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, verbose_name="Equipo")
    tipo_conexion = models.CharField(max_length=20, verbose_name="Tipo de Conexión")
    ip_publica = models.CharField(max_length=20, blank=True, null=True, verbose_name="IP Pública")
    ip_privada = models.CharField(max_length=20, verbose_name="IP Privada")
    mascara_subred = models.CharField(max_length=20, blank=True, null=True, verbose_name="Máscara de Subred")
    gateway = models.CharField(max_length=20, blank=True, null=True, verbose_name="Gateway")
    dns_primario = models.CharField(max_length=20, blank=True, null=True, verbose_name="DNS Primario")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Conexión de Red"
        verbose_name_plural = "Conexiones de Red"
        ordering = ['equipo']

    def __str__(self):
        return f"Conexión de {self.equipo} - {self.ip_privada}"