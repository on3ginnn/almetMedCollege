from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
import rest_framework.generics
from rest_framework import status
from rest_framework.response import Response
import rest_framework.permissions
from rest_framework_simplejwt import views as jwt_views
from django.contrib.auth import get_user_model

import group.serializer
import users.permissions
import group.models


class GroupCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    serializer_class = group.serializer.GroupCreateSerializer
    queryset = group.models.Group.objects.all()


class GroupListAPIView(rest_framework.generics.ListAPIView):
    queryset = group.models.Group.objects.all()
    serializer_class = group.serializer.GroupSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]


class GroupDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    queryset = group.models.Group.objects.all()
    serializer_class = group.serializer.GroupUpdateSerializer
