from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from apps.ubicaciones.models import Ubicacion
from api.v1.serializers.ubicaciones import UbicacionSerializer

class UbicacionViewSet(viewsets.ModelViewSet):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['codigo', 'ciudad', 'estado', 'activo']
    search_fields = ['nombre', 'codigo', 'ciudad']

# Router URLs
