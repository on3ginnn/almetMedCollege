import rest_framework.generics
import rest_framework.permissions

import schedule.serializer
import users.permissions
import schedule.models


class ClassroomListAPIView(rest_framework.generics.ListAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]
    queryset = schedule.models.ClassRoom.objects.all()
    serializer_class = schedule.serializer.ClassRoomSerializer


class ScheduleCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    serializer_class = schedule.serializer.ScheduleCreateSerializer
    queryset = schedule.models.Schedule.objects.prefetch_related(
        "group",
        "lessons__major",
        "lessons__teacher",
        "lessons__classroom"
    )


class ScheduleListAPIView(rest_framework.generics.ListAPIView):
    # queryset = schedule.models.Schedule.objects.all()
    """
    оптимизация запросов к бд
    """
    queryset = schedule.models.Schedule.objects.prefetch_related(
        "group",
        "lessons__major",
        "lessons__teacher",
        "lessons__classroom"
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
        "lessons__major",
        "lessons__teacher",
        "lessons__classroom"
    )
    serializer_class = schedule.serializer.ScheduleSerializer


class ScheduleDateGroup(rest_framework.generics.RetrieveAPIView):
    queryset = schedule.models.Schedule.objects.all()
    serializer_class = schedule.serializer.ScheduleSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]
    lookup_field = "group"
    
    def retrieve(self, request, *args, **kwargs):
        self.queryset = schedule.models.Schedule.objects.filter(date=request.query_params.get("date"))
        print(request.query_params)
        print(self.kwargs)

        self.kwargs = {self.lookup_field: request.query_params.get(self.lookup_field)}
        print(self.kwargs)

        return super().retrieve(request, *args, **kwargs)
    
