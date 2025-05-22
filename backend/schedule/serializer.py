import datetime

from django.contrib.auth import get_user_model
from django.db.models import Prefetch
import rest_framework.serializers
import rest_framework.validators

import schedule.models
import major.models
import group.models
import users.models

USER_MODEL = get_user_model()


class ClassRoomSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = schedule.models.ClassRoom
        fields = ['id', 'label']


class GroupLessonSerializer(rest_framework.serializers.ModelSerializer):
    # major = major.serializer.MajorSerializer()
    major = rest_framework.serializers.CharField(source='major.title')
    # teacher = users.serializer.UserSerializer()
    teacher = rest_framework.serializers.CharField(source='teacher.get_full_name')
    # classroom = ClassRoomSerializer()
    classroom = rest_framework.serializers.CharField(source='classroom.label')

    class Meta:
        model = schedule.models.GroupLesson
        fields = ['id', 'number', 'subgroup', 'major', 'teacher', 'classroom']
        validators = [
            rest_framework.validators.UniqueTogetherValidator(
                queryset=schedule.models.GroupLesson.objects.all(),
                fields=['schedule', 'number', 'subgroup', 'classroom']
            )
        ]


class ScheduleClassroomBusySerializer(rest_framework.serializers.ModelSerializer):
    lessons = GroupLessonSerializer(many=True)
    queryset = schedule.models.Schedule.objects.prefetch_related(
        Prefetch('lessons', queryset=schedule.models.GroupLesson.objects.select_related('classroom'))
    )
    class Meta:
        model = schedule.models.Schedule
        fields = ['id', 'date', 'group', 'lessons']

    def validate(self, attrs):
        existing = schedule.models.Schedule.objects.filter(
            date=attrs['date'],
            lessons__number=attrs['lessons']['number'],
            lessons__classroom=attrs['lessons']['classroom']
        ).exclude(group=attrs['group']).exists()
        
        if existing:
            raise rest_framework.serializers.ValidationError("Кабинет уже занят в другой группе на эту пару")
        return attrs


class ScheduleTeacherBusySerializer(rest_framework.serializers.ModelSerializer):
    lessons = GroupLessonSerializer(many=True)
    queryset = schedule.models.Schedule.objects.prefetch_related(
        Prefetch('lessons', queryset=schedule.models.GroupLesson.objects.select_related('teacher'))
    )
    class Meta:
        model = schedule.models.Schedule
        fields = ['id', 'date', 'group', 'lessons']

    def validate(self, attrs):
        existing = schedule.models.Schedule.objects.filter(
            date=attrs['date'],
            lessons__number=attrs['lessons']['number'],
            lessons__teacher=attrs['lessons']['teacher']
        ).exclude(group=attrs['group']).exists()
        
        if existing:
            raise rest_framework.serializers.ValidationError("Преподаватель уже занят в другой группе на эту пару")
        return attrs


class ScheduleSerializer(rest_framework.serializers.ModelSerializer):
    lessons = GroupLessonSerializer(many=True)

    class Meta:
        model = schedule.models.Schedule
        fields = ['id', 'date', 'group', 'lessons']


class GroupLessonCreateSerializer(rest_framework.serializers.ModelSerializer):
    major = rest_framework.serializers.PrimaryKeyRelatedField(queryset=major.models.Major.objects.all())
    teacher = rest_framework.serializers.PrimaryKeyRelatedField(queryset=users.models.User.objects.filter(role__in=[USER_MODEL.Role.TEACHER, USER_MODEL.Role.ADMIN]))
    classroom = rest_framework.serializers.PrimaryKeyRelatedField(queryset=schedule.models.ClassRoom.objects.all())
    class Meta:
        model = schedule.models.GroupLesson
        fields = ['number', 'subgroup', 'major', 'teacher', 'classroom']


# class ScheduleCreateSerializer(rest_framework.serializers.ModelSerializer):
#     group = rest_framework.serializers.CharField(source='group.name')
#     lessons = GroupLessonCreateSerializer(many=True)

#     class Meta:
#         model = schedule.models.Schedule
#         fields = ['date', 'group', 'lessons']

#     def create(self, validated_data):
#         print(validated_data)
#         lessons_data = validated_data.pop('lessons')
#         print(lessons_data)
        
#         # Получаем группу по имени
class ScheduleCreateSerializer(rest_framework.serializers.ModelSerializer):
    lessons = GroupLessonCreateSerializer(many=True)
    group = rest_framework.serializers.PrimaryKeyRelatedField(queryset=group.models.Group.objects.all())

    class Meta:
        model = schedule.models.Schedule
        fields = ["date", 'group', 'lessons']

    def create(self, validated_data):
        print(validated_data)
        lessons_data = validated_data.pop('lessons')        
        # Создаем расписание
        schedule_obj = schedule.models.Schedule.objects.get_or_create(group=validated_data['group'], date=validated_data['date'])[0]
        print(schedule_obj)
        
        # Создаем уроки и связываем их с расписанием
        for lesson_data in lessons_data:
            print(lesson_data)

            schedule.models.GroupLesson.objects.create(
                schedule=schedule_obj,
                number=lesson_data['number'],
                subgroup=lesson_data['subgroup'],
                major=lesson_data['major'],
                teacher=lesson_data['teacher'],
                classroom=lesson_data['classroom']
            )
        
        return schedule_obj
