import rest_framework_simplejwt.authentication
import django.conf
from django.utils.decorators import method_decorator
import users.utils


class CookieJWTAuthentication(rest_framework_simplejwt.authentication.JWTAuthentication):

    # @method_decorator(users.utils.enforce_csrf)
    def authenticate(self, request):
        # header = self.get_header(request)
        
        # if header is None:
        #     raw_token = request.COOKIES.get(django.conf.settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        # else:
        #     raw_token = self.get_raw_token(header)
        raw_token = request.COOKIES.get(django.conf.settings.SIMPLE_JWT['AUTH_COOKIE']) or None

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)

        return self.get_user(validated_token), validated_token