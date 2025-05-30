from rest_framework.views import APIView
import rest_framework.generics
from rest_framework import status
from rest_framework.response import Response
import rest_framework.permissions
from rest_framework_simplejwt import views as jwt_views
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils.decorators import method_decorator

import users.utils
import users.serializer
import users.permissions


class UserLogoutAPIView(APIView):
   def get(self, request):
        response = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')  # Удаляем cookie
        return response
   

class UserCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    serializer_class = users.serializer.UserCreateSerializer
    queryset = get_user_model().objects.all()


class UserLoginAPIView(jwt_views.TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data['access']
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],  # Имя cookie
            value=access_token,  # Значение (access токен)
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],       # HTTP-only
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],       # Для HTTPS установите True
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],      # Политика SameSite
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],        # Время жизни cookie (в секундах)
        )
        
        del response.data['access']
        del response.data['refresh']

        return response


class UserProfileAPIView(APIView):
    permission_classes = [rest_framework.permissions.IsAuthenticated]
    serializer_class = users.serializer.UserSerializer

    def get(self, request):
        user = request.user
        print("Authenticated user:", user)  # Логируем пользователяЁЁ
        serializer = self.serializer_class(user)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserListAPIView(rest_framework.generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserListWithPasswordSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]


class UserTeacherListAPIView(rest_framework.generics.ListAPIView):
    queryset = get_user_model().objects.filter(role="teacher")
    serializer_class = users.serializer.TeacherListSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]


class UserDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserUpdateSerializer


class UserSearchAPIView(rest_framework.generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserSerializer
    lookup_field = "username"
    
    def retrieve(self, request, *args, **kwargs):
        self.kwargs = {"username":request.GET.get("username")}

        return super().retrieve(request, *args, **kwargs)
    

class UserListFilterByRoleAPIView(rest_framework.generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserListWithPasswordSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    lookup_field = "role"
    
    def retrieve(self, request, *args, **kwargs):
        self.kwargs = {"role":request.GET.get("role")}

        return super().retrieve(request, *args, **kwargs)
    
