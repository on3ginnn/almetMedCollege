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


class UserRegisterAPIView(rest_framework.generics.CreateAPIView):
    serializer_class = users.serializer.RegisterSerializer
    queryset = get_user_model().objects.all()


class UserLoginAPIView(jwt_views.TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        return Response({"tokens": response.data}, status=response.status_code)


class UserProfileAPIView(APIView):
    permission_classes = [rest_framework.permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        print(user.groups)
        print(user.get_user_permissions)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
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


class UserDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [rest_framework.permissions.IsAuthenticatedOrReadOnly]
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.RegisterSerializer


class UserSearchAPIView(rest_framework.generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = users.serializer.UserSerializer
    lookup_field = "username"
    
    def retrieve(self, request, *args, **kwargs):
        self.kwargs = {"username":request.GET.get("username")}

        return super().retrieve(request, *args, **kwargs)