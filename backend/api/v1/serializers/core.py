from rest_framework import serializers
from apps.core.models import AsignacionEquipo, HistorialUbicacion, ConexionRed
from apps.usuarios.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email']  # Ajusta con tus campos reales

class AsignacionEquipoSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.ReadOnlyField(source='equipo.nombre')
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre_completo')
    asignado_por = serializers.ReadOnlyField(source='asignado_por_usuario.nombre_completo')

    class Meta:
        model = AsignacionEquipo
        fields = '__all__'

class AsignacionEquipoDetalleSerializer(serializers.ModelSerializer):
    # Movidas las importaciones fuera de la clase para evitar problemas
    # from api.v1.serializers.equipos import EquipoSerializer
    # from api.v1.serializers.usuarios import UsuarioSerializer

    # Reemplazadas por referencias strings para evitar importaciones circulares
    equipo = serializers.SerializerMethodField()
    usuario = serializers.SerializerMethodField()
    asignado_por_usuario = serializers.SerializerMethodField()

    def get_equipo(self, obj):
        from api.v1.serializers.equipos import EquipoSerializer
        return EquipoSerializer(obj.equipo).data

    def get_usuario(self, obj):
        return UsuarioSerializer(obj.usuario).data

    def get_asignado_por_usuario(self, obj):
        return UsuarioSerializer(obj.asignado_por_usuario).data

    class Meta:
        model = AsignacionEquipo
        fields = '__all__'
        depth = 1

class HistorialUbicacionSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.ReadOnlyField(source='equipo.nombre')
    ubicacion_anterior = serializers.ReadOnlyField(source='ubicacion_anterior.nombre')
    ubicacion_nueva = serializers.ReadOnlyField(source='ubicacion_nueva.nombre')
    registrado_por = serializers.ReadOnlyField(source='registrado_por_usuario.nombre_completo')

    class Meta:
        model = HistorialUbicacion
        fields = '__all__'

class ConexionRedSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.ReadOnlyField(source='equipo.nombre')

    class Meta:
        model = ConexionRed
        fields = '__all__'