from rest_framework import serializers
from apps.usuarios.models import Usuario, Area

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    area_nombre = serializers.ReadOnlyField(source='area.nombre')
    ubicacion_nombre = serializers.ReadOnlyField(source='ubicacion.nombre')

    class Meta:
        model = Usuario
        fields = '__all__'

class UsuarioDetalleSerializer(serializers.ModelSerializer):
    area = AreaSerializer(read_only=True)
    ubicacion = serializers.SerializerMethodField()

    def get_ubicacion(self, obj):
        from api.v1.serializers.ubicaciones import UbicacionSerializer
        return UbicacionSerializer(obj.ubicacion).data

    class Meta:
        model = Usuario
        fields = '__all__'
        depth = 1