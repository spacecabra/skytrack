from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Llamar primero al manejador de excepciones predeterminado
    response = exception_handler(exc, context)

    # Si hay una respuesta (se detectó una excepción)
    if response is not None:
        # Personalizar la respuesta si es necesario
        response.data['status_code'] = response.status_code

    return response