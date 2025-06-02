from django.urls import path
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.models import AsignacionEquipo, HistorialUbicacion, ConexionRed
from api.v1.serializers.core import (
    AsignacionEquipoSerializer, AsignacionEquipoDetalleSerializer,
    HistorialUbicacionSerializer, ConexionRedSerializer
)

class AsignacionEquipoViewSet(viewsets.ModelViewSet):
    queryset = AsignacionEquipo.objects.all()
    serializer_class = AsignacionEquipoSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipo', 'usuario', 'fecha_asignacion', 'estado_asignacion']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AsignacionEquipoDetalleSerializer
        return AsignacionEquipoSerializer

    @action(detail=False, methods=['get'])
    def activas(self, request):
        """Retorna solo las asignaciones activas"""
        asignaciones = AsignacionEquipo.objects.filter(estado_asignacion='ACTIVA')
        page = self.paginate_queryset(asignaciones)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(asignaciones, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def finalizar(self, request, pk=None):
        """Finaliza una asignación"""
        asignacion = self.get_object()

        if asignacion.estado_asignacion != 'ACTIVA':
            return Response(
                {'error': 'Solo se pueden finalizar asignaciones activas'},
                status=status.HTTP_400_BAD_REQUEST
            )

        asignacion.estado_asignacion = 'FINALIZADA'
        asignacion.fecha_devolucion = request.data.get('fecha_devolucion')
        asignacion.observaciones = request.data.get('observaciones', asignacion.observaciones)
        asignacion.save()

        serializer = self.get_serializer(asignacion)
        return Response(serializer.data)

class HistorialUbicacionViewSet(viewsets.ModelViewSet):
    queryset = HistorialUbicacion.objects.all()
    serializer_class = HistorialUbicacionSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipo', 'ubicacion_anterior', 'ubicacion_nueva', 'fecha_cambio']

class ConexionRedViewSet(viewsets.ModelViewSet):
    queryset = ConexionRed.objects.all()
    serializer_class = ConexionRedSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipo', 'tipo_conexion', 'activo']
    search_fields = ['ip_publica', 'ip_privada', 'dns_primario']


