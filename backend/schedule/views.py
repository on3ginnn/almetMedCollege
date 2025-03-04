import rest_framework.generics
import rest_framework.permissions

import schedule.serializer
import users.permissions
import schedule.models


class ScheduleCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    serializer_class = schedule.serializer.ScheduleCreateSerializer
    queryset = schedule.models.Schedule.objects.prefetch_related(
        "group",
        "lessons_set__major",
        "lessons_set__teacher",
        "lessons_set__classroom"
    )


class ScheduleListAPIView(rest_framework.generics.ListAPIView):
    # queryset = schedule.models.Schedule.objects.all()
    """
    оптимизация запросов к бд
    """
    queryset = schedule.models.Schedule.objects.prefetch_related(
        "group",
        "lessons_set__major",
        "lessons_set__teacher",
        "lessons_set__classroom"
    )
    serializer_class = schedule.serializer.ScheduleSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]


class ScheduleDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]
    # queryset = schedule.models.Schedule.objects.all()
    """
    оптимизация запросов к бд
    """
    queryset = schedule.models.Schedule.objects.prefetch_related(
        "group",
        "lessons_set__major",
        "lessons_set__teacher",
        "lessons_set__classroom"
    )
    serializer_class = schedule.serializer.ScheduleSerializer
