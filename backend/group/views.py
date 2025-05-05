import rest_framework.generics
import rest_framework.permissions

import group.serializer
import users.permissions
import group.models


class GroupCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    serializer_class = group.serializer.GroupCreateSerializer
    queryset = group.models.Group.objects.all()


class GroupListAPIView(rest_framework.generics.ListAPIView):
    queryset = group.models.Group.objects.all()
    serializer_class = group.serializer.ScheduleGroupSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]


class GroupDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    queryset = group.models.Group.objects.all()
    serializer_class = group.serializer.GroupUpdateSerializer
