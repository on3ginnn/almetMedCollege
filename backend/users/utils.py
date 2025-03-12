from functools import wraps
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework import exceptions


def enforce_csrf(func):
    """
    Декоратор для принудительной проверки CSRF.
    """
    @wraps(func)
    def wrapped_view(request, *args, **kwargs):
        middleware = CsrfViewMiddleware(lambda request: None)
        # Вызываем метод process_request для проверки CSRF
        middleware.process_request(request)
        
        # Проверяем, есть ли ошибки
        reason = middleware.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)
        
        return func(request, *args, **kwargs)
    
    return wrapped_view