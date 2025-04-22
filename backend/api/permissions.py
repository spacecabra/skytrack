from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permite acceso solo a usuarios administradores.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permite a los propietarios de un objeto editarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura permitidos para cualquier solicitud
        if request.method in permissions.SAFE_METHODS:
            return True

        # Los permisos de escritura solo se permiten al propietario
        return obj.usuario == request.user
