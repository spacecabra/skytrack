from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.consumibles.models import Consumible, ConsumibleEquipo, ConsumoHistorico
from api.v1.serializers.consumibles import (
    ConsumibleSerializer, ConsumibleDetalleSerializer,
    ConsumibleEquipoSerializer, ConsumibleEquipoDetalleSerializer,
    ConsumoHistoricoSerializer, ConsumoHistoricoDetalleSerializer
)

class ConsumibleViewSet(viewsets.ModelViewSet):
    queryset = Consumible.objects.all()
    serializer_class = ConsumibleSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo', 'fabricante', 'ubicacion', 'activo']
    search_fields = ['modelo', 'compatibilidad']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConsumibleDetalleSerializer
        return ConsumibleSerializer

    @action(detail=False, methods=['get'])
    def stock_bajo(self, request):
        """Retorna consumibles con stock bajo"""
        consumibles = Consumible.objects.filter(
            cantidad_disponible__lte=models.F('cantidad_minima'),
            activo=True
        )

        page = self.paginate_queryset(consumibles)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(consumibles, many=True)
        return Response(serializer.data)

class ConsumibleEquipoViewSet(viewsets.ModelViewSet):
    queryset = ConsumibleEquipo.objects.all()
    serializer_class = ConsumibleEquipoSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['consumible', 'equipo']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConsumibleEquipoDetalleSerializer
        return ConsumibleEquipoSerializer

class ConsumoHistoricoViewSet(viewsets.ModelViewSet):
    queryset = ConsumoHistorico.objects.all()
    serializer_class = ConsumoHistoricoSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['consumible', 'equipo', 'fecha_consumo']
    search_fields = ['solicitado_por', 'autorizado_por', 'motivo']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConsumoHistoricoDetalleSerializer
        return ConsumoHistoricoSerializer

