import rest_framework.generics
import rest_framework.permissions
import rest_framework.response
from django.db.models import Prefetch

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


class BusyClassroomsAPIView(rest_framework.views.APIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]
    serializer_class = schedule.serializer.ScheduleClassroomBusySerializer
    queryset = schedule.models.Schedule.objects.prefetch_related(
        Prefetch('lessons', queryset=schedule.models.GroupLesson.objects.select_related('classroom'))
    )

    def get(self, request):
        date = request.query_params.get('date')
        lessons = schedule.models.Schedule.objects.filter(date=date).values_list(
            'lessons__number', 'lessons__classroom'
        )
        print(lessons)
        return rest_framework.response.Response([
            {'lessonNumber': num, 'classroomId': cr} 
            for num, cr in lessons
        ])


class BusyTeachersAPIView(rest_framework.views.APIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroupsOrReadOnly]
    serializer_class = schedule.serializer.ScheduleTeacherBusySerializer
    queryset = schedule.models.Schedule.objects.prefetch_related(
        Prefetch('lessons', queryset=schedule.models.GroupLesson.objects.select_related('teacher'))
    )

    def get(self, request):
        date = request.query_params.get('date')
        lessons = schedule.models.Schedule.objects.filter(date=date).values_list(
            'lessons__number', 'lessons__teacher'
        )
        print(lessons)
        return rest_framework.response.Response([
            {'lessonNumber': num, 'teacherId': tid} 
            for num, tid in lessons
        ])


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
    
