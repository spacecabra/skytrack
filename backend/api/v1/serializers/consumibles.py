from rest_framework import serializers
from apps.consumibles.models import Consumible, ConsumibleEquipo, ConsumoHistorico

class ConsumibleSerializer(serializers.ModelSerializer):
    fabricante_nombre = serializers.ReadOnlyField(source='fabricante.nombre')
    ubicacion_nombre = serializers.ReadOnlyField(source='ubicacion.nombre')

    class Meta:
        model = Consumible
        fields = '__all__'

class ConsumibleDetalleSerializer(serializers.ModelSerializer):
    def get_fabricante(self, obj):
        from api.v1.serializers.equipos import FabricanteSerializer
        return FabricanteSerializer(obj.fabricante).data

    def get_ubicacion(self, obj):
        from api.v1.serializers.ubicaciones import UbicacionSerializer
        return UbicacionSerializer(obj.ubicacion).data

    fabricante = serializers.SerializerMethodField()
    ubicacion = serializers.SerializerMethodField()

    class Meta:
        model = Consumible
        fields = '__all__'
        depth = 1

class ConsumibleEquipoSerializer(serializers.ModelSerializer):
    consumible_nombre = serializers.ReadOnlyField(source='consumible.modelo')
    equipo_nombre = serializers.ReadOnlyField(source='equipo.nombre')

    class Meta:
        model = ConsumibleEquipo
        fields = '__all__'

class ConsumibleEquipoDetalleSerializer(serializers.ModelSerializer):
    def get_consumible(self, obj):
        return ConsumibleSerializer(obj.consumible).data

    def get_equipo(self, obj):
        from api.v1.serializers.equipos import EquipoSerializer
        return EquipoSerializer(obj.equipo).data

    consumible = serializers.SerializerMethodField()
    equipo = serializers.SerializerMethodField()

    class Meta:
        model = ConsumibleEquipo
        fields = '__all__'
        depth = 1

class ConsumoHistoricoSerializer(serializers.ModelSerializer):
    consumible_nombre = serializers.ReadOnlyField(source='consumible.modelo')
    equipo_nombre = serializers.ReadOnlyField(source='equipo.nombre')

    class Meta:
        model = ConsumoHistorico
        fields = '__all__'

class ConsumoHistoricoDetalleSerializer(serializers.ModelSerializer):
    def get_consumible(self, obj):
        return ConsumibleSerializer(obj.consumible).data

    def get_equipo(self, obj):
        from api.v1.serializers.equipos import EquipoSerializer
        return EquipoSerializer(obj.equipo).data

    consumible = serializers.SerializerMethodField()
    equipo = serializers.SerializerMethodField()

    class Meta:
        model = ConsumoHistorico
        fields = '__all__'
        depth = 1