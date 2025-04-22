from rest_framework import serializers
from apps.mantenimientos.models import Mantenimiento, Garantia

class MantenimientoSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.ReadOnlyField(source='equipo.nombre')

    class Meta:
        model = Mantenimiento
        fields = '__all__'

class MantenimientoDetalleSerializer(serializers.ModelSerializer):
    def get_equipo(self, obj):
        from api.v1.serializers.equipos import EquipoSerializer
        return EquipoSerializer(obj.equipo).data

    equipo = serializers.SerializerMethodField()

    class Meta:
        model = Mantenimiento
        fields = '__all__'
        depth = 1

class GarantiaSerializer(serializers.ModelSerializer):
    equipo_nombre = serializers.ReadOnlyField(source='equipo.nombre')

    class Meta:
        model = Garantia
        fields = '__all__'

class GarantiaDetalleSerializer(serializers.ModelSerializer):
    def get_equipo(self, obj):
        from api.v1.serializers.equipos import EquipoSerializer
        return EquipoSerializer(obj.equipo).data

    equipo = serializers.SerializerMethodField()

    class Meta:
        model = Garantia
        fields = '__all__'
        depth = 1