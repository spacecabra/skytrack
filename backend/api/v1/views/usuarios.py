from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from apps.usuarios.models import Usuario, Area
from api.v1.serializers.usuarios import UsuarioSerializer, UsuarioDetalleSerializer, AreaSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['activo']
    search_fields = ['nombre', 'descripcion']

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['area', 'ubicacion', 'activo']
    search_fields = ['nombre_usuario', 'nombre_completo', 'email']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UsuarioDetalleSerializer
        return UsuarioSerializer

# Router URLs
