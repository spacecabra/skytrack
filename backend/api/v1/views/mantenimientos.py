from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.mantenimientos.models import Mantenimiento, Garantia
from api.v1.serializers.mantenimientos import (
    MantenimientoSerializer, MantenimientoDetalleSerializer,
    GarantiaSerializer, GarantiaDetalleSerializer
)
from datetime import date

class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipo', 'tipo', 'resultado']
    search_fields = ['descripcion', 'responsable']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MantenimientoDetalleSerializer
        return MantenimientoSerializer

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """Retorna los mantenimientos pendientes"""
        mantenimientos = Mantenimiento.objects.filter(resultado='PENDIENTE')
        page = self.paginate_queryset(mantenimientos)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(mantenimientos, many=True)
        return Response(serializer.data)

class GarantiaViewSet(viewsets.ModelViewSet):
    queryset = Garantia.objects.all()
    serializer_class = GarantiaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipo', 'proveedor', 'activa']
    search_fields = ['proveedor', 'condiciones']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GarantiaDetalleSerializer
        return GarantiaSerializer

    @action(detail=False, methods=['get'])
    def por_vencer(self, request):
        """Retorna garantías que vencen en los próximos 30 días"""
        hoy = date.today()
        desde = hoy
        hasta = hoy.replace(month=hoy.month + 1) if hoy.month < 12 else hoy.replace(year=hoy.year + 1, month=1)

        garantias = Garantia.objects.filter(
            fecha_fin__gte=desde,
            fecha_fin__lte=hasta,
            activa=True
        )

        page = self.paginate_queryset(garantias)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(garantias, many=True)
        return Response(serializer.data)

