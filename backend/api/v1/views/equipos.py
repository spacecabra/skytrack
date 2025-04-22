from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.equipos.models import CategoriaEquipo, Fabricante, Modelo, EstadoEquipo, Equipo
from api.v1.serializers.equipos import (
    CategoriaEquipoSerializer, FabricanteSerializer, ModeloSerializer, ModeloDetalleSerializer,
    EstadoEquipoSerializer, EquipoSerializer, EquipoDetalleSerializer
)

class CategoriaEquipoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaEquipo.objects.all()
    serializer_class = CategoriaEquipoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['activo']
    search_fields = ['nombre', 'descripcion']

class FabricanteViewSet(viewsets.ModelViewSet):
    queryset = Fabricante.objects.all()
    serializer_class = FabricanteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['activo']
    search_fields = ['nombre', 'contacto']

class ModeloViewSet(viewsets.ModelViewSet):
    queryset = Modelo.objects.all()
    serializer_class = ModeloSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['fabricante', 'categoria', 'activo']
    search_fields = ['nombre', 'tipo_componente']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ModeloDetalleSerializer
        return ModeloSerializer

class EstadoEquipoViewSet(viewsets.ModelViewSet):
    queryset = EstadoEquipo.objects.all()
    serializer_class = EstadoEquipoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['permite_asignacion']
    search_fields = ['nombre', 'descripcion']

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado', 'modelo', 'categoria', 'ubicacion', 'area']
    search_fields = ['nombre', 'serie', 'direccion_ip']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EquipoDetalleSerializer
        return EquipoSerializer

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Retorna solo los equipos disponibles para asignación"""
        estados_disponibles = EstadoEquipo.objects.filter(permite_asignacion=True).values_list('id', flat=True)
        equipos = Equipo.objects.filter(estado_id__in=estados_disponibles)
        page = self.paginate_queryset(equipos)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(equipos, many=True)
        return Response(serializer.data)

# Router URLs
