from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
import rest_framework.generics
from rest_framework import status
from rest_framework.response import Response
import rest_framework.permissions
from rest_framework_simplejwt import views as jwt_views
from django.contrib.auth import get_user_model

import users.serializer
import users.permissions


class UserCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [rest_framework.permissions.DjangoModelPermissions]
    serializer_class = users.serializer.UserCreateSerializer
    queryset = get_user_model().objects.all()


class UserLoginAPIView(jwt_views.TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        return Response({"tokens": response.data}, status=response.status_code)


class UserProfileAPIView(APIView):
    permission_classes = [rest_framework.permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        print(user.groups.all())
        print(user.get_user_permissions)

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "group": (user.group and user.group.name) or None,
            "perm": {
                "view": user.has_perm("product.view_item"),
                "add": user.has_perm("product.add_item"),
                "change": user.has_perm("product.change_item"),
                "delete": user.has_perm("product.delete_item"),
            }
        }, status=status.HTTP_200_OK)


class UserListAPIView(rest_framework.generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]


class UserDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserCreateSerializer


class UserSearchAPIView(rest_framework.generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserSerializer
    lookup_field = "username"
    
    def retrieve(self, request, *args, **kwargs):
        self.kwargs = {"username":request.GET.get("username")}

        return super().retrieve(request, *args, **kwargs)