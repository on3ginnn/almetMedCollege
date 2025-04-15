from django.shortcuts import render
import rest_framework.generics

import users.permissions 
import major.serializer
import major.models

class MajorCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    serializer_class = major.serializer.MajorSerializer
    queryset = major.models.Major.objects.all()


class MajorListAPIView(rest_framework.generics.ListAPIView):
    queryset = major.models.Major.objects.all()
    serializer_class = major.serializer.MajorSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]


class MajorDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]
    queryset = major.models.Major.objects.all()
    """
    оптимизация запросов к бд
    """
    queryset = major.models.Major.objects.all()
    serializer_class = major.serializer.MajorSerializer