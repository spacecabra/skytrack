from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """
    Endpoint para login de usuarios
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Se requiere username y password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Autenticar usuario
    user = authenticate(username=username, password=password)
    
    if user:
        # Crear o obtener token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'message': 'Login exitoso'
        })
    else:
        return Response({
            'error': 'Credenciales inválidas'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """
    Endpoint para logout de usuarios
    """
    try:
        # Eliminar token del usuario
        token = Token.objects.get(user=request.user)
        token.delete()
        
        return Response({
            'message': 'Logout exitoso'
        })
    except Token.DoesNotExist:
        return Response({
            'error': 'Token no encontrado'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_info(request):
    """
    Endpoint para obtener información del usuario actual
    """
    user = request.user
    
    return Response({
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'first_name': user.first_name,
        'last_name': user.last_name,
    })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """
    Endpoint para registrar nuevos usuarios (opcional)
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    
    if not username or not password:
        return Response({
            'error': 'Se requiere username y password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar si el usuario ya existe
    if User.objects.filter(username=username).exists():
        return Response({
            'error': 'El usuario ya existe'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Crear usuario
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )
    
    # Crear token
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'message': 'Usuario creado exitosamente'
    }, status=status.HTTP_201_CREATED)