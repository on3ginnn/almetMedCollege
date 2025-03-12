from functools import wraps
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions, request, response


def enforce_csrf(func):
    """
    Декоратор для принудительной проверки CSRF.
    """
    @wraps(func)
    def wrapped_view(request, *args, **kwargs):
        check = CSRFCheck(dummy_get_response)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied('CSRF Failed: %s' % reason) 
        return func(request, *args, **kwargs)
    return wrapped_view