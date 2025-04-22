from rest_framework import serializers
from apps.equipos.models import CategoriaEquipo, Fabricante, Modelo, EstadoEquipo, Equipo

class CategoriaEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaEquipo
        fields = '__all__'

class FabricanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fabricante
        fields = '__all__'

class ModeloSerializer(serializers.ModelSerializer):
    fabricante_nombre = serializers.ReadOnlyField(source='fabricante.nombre')
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Modelo
        fields = '__all__'

class ModeloDetalleSerializer(serializers.ModelSerializer):
    fabricante = FabricanteSerializer(read_only=True)
    categoria = CategoriaEquipoSerializer(read_only=True)

    class Meta:
        model = Modelo
        fields = '__all__'
        depth = 1

class EstadoEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoEquipo
        fields = '__all__'

class EquipoSerializer(serializers.ModelSerializer):
    estado_nombre = serializers.ReadOnlyField(source='estado.nombre')
    modelo_nombre = serializers.ReadOnlyField(source='modelo.nombre')
    ubicacion_nombre = serializers.ReadOnlyField(source='ubicacion.nombre')
    area_nombre = serializers.ReadOnlyField(source='area.nombre')

    class Meta:
        model = Equipo
        fields = '__all__'

class EquipoDetalleSerializer(serializers.ModelSerializer):
    estado = EstadoEquipoSerializer(read_only=True)
    modelo = ModeloSerializer(read_only=True)
    categoria = CategoriaEquipoSerializer(read_only=True)

    def get_ubicacion(self, obj):
        from api.v1.serializers.ubicaciones import UbicacionSerializer
        return UbicacionSerializer(obj.ubicacion).data

    def get_area(self, obj):
        from api.v1.serializers.usuarios import AreaSerializer
        return AreaSerializer(obj.area).data

    ubicacion = serializers.SerializerMethodField()
    area = serializers.SerializerMethodField()

    class Meta:
        model = Equipo
        fields = '__all__'
        depth = 1