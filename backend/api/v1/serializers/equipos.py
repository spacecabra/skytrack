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
    fabricante_nombre = serializers.ReadOnlyField(source='modelo.fabricante.nombre')
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    ubicacion_nombre = serializers.ReadOnlyField(source='ubicacion.nombre')
    area_nombre = serializers.ReadOnlyField(source='area.nombre')

    class Meta:
        model = Equipo
        fields = '__all__'

class EquipoDetalleSerializer(serializers.ModelSerializer):
    # Información del estado
    estado_nombre = serializers.ReadOnlyField(source='estado.nombre')
    estado_descripcion = serializers.ReadOnlyField(source='estado.descripcion')
    
    # Información del modelo y fabricante
    modelo_nombre = serializers.ReadOnlyField(source='modelo.nombre')
    fabricante_nombre = serializers.ReadOnlyField(source='modelo.fabricante.nombre')
    fabricante_contacto = serializers.ReadOnlyField(source='modelo.fabricante.contacto')
    fabricante_sitio_web = serializers.ReadOnlyField(source='modelo.fabricante.sitio_web')
    
    # Información de la categoría
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    categoria_descripcion = serializers.ReadOnlyField(source='categoria.descripcion')
    
    # Información de ubicación
    ubicacion_codigo = serializers.ReadOnlyField(source='ubicacion.codigo')
    ubicacion_nombre = serializers.ReadOnlyField(source='ubicacion.nombre')
    ubicacion_ciudad = serializers.ReadOnlyField(source='ubicacion.ciudad')
    ubicacion_estado = serializers.ReadOnlyField(source='ubicacion.estado')
    ubicacion_direccion = serializers.ReadOnlyField(source='ubicacion.direccion')
    
    # Información del área
    area_nombre = serializers.ReadOnlyField(source='area.nombre')
    area_descripcion = serializers.ReadOnlyField(source='area.descripcion')
    
    # Objetos completos para referencias
    estado = EstadoEquipoSerializer(read_only=True)
    modelo = ModeloDetalleSerializer(read_only=True)
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