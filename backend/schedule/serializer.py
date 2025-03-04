import datetime

import rest_framework.serializers

import schedule.models
import major.models
import users.serializer
import group.serializer
import major.serializer
import users.models


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


class ScheduleSerializer(rest_framework.serializers.ModelSerializer):
    # group = group.serializer.GroupSerializer()
    group = rest_framework.serializers.CharField(source='group.name')
    lessons = GroupLessonSerializer(many=True, source='lessons_set')

    class Meta:
        model = schedule.models.Schedule
        fields = ['id', 'date', 'group', 'lessons']


class GroupLessonCreateSerializer(rest_framework.serializers.ModelSerializer):
    major = rest_framework.serializers.CharField(source='major.title')
    teacher = rest_framework.serializers.CharField(source='teacher.username')
    classroom = rest_framework.serializers.CharField(source='classroom.label')

    class Meta:
        model = schedule.models.GroupLesson
        fields = ['number', 'subgroup', 'major', 'teacher', 'classroom']


class ScheduleCreateSerializer(rest_framework.serializers.ModelSerializer):
    group = rest_framework.serializers.CharField(source='group.name')
    lessons = GroupLessonCreateSerializer(many=True)

    class Meta:
        model = schedule.models.Schedule
        fields = ['group', 'lessons']

    def create(self, validated_data):
        print(validated_data)
        lessons_data = validated_data.pop('lessons')
        print(lessons_data)
        
        # Получаем группу по имени
class ScheduleCreateSerializer(rest_framework.serializers.ModelSerializer):
    group = rest_framework.serializers.CharField(source='group.name')
    lessons = GroupLessonCreateSerializer(many=True)

    class Meta:
        model = schedule.models.Schedule
        fields = ['group', 'lessons']

    def create(self, validated_data):
        print(validated_data)
        lessons_data = validated_data.pop('lessons')
        print(lessons_data)
        print(validated_data['group'])
        # Получаем группу по имени
        group_obj = group.models.Group.objects.get(name=validated_data['group']['name'])
        print(group_obj)
        
        # Создаем расписание
        schedule_obj = schedule.models.Schedule.objects.get_or_create(group=group_obj, date=str(datetime.date.today()))[0]
        print(schedule_obj)
        
        # Создаем уроки и связываем их с расписанием
        for lesson_data in lessons_data:
            print(lesson_data)
            major_obj = major.models.Major.objects.get(title=lesson_data['major']['title'])
            teacher_obj = users.models.User.objects.get(username=lesson_data['teacher']['username'])
            classroom_obj = schedule.models.ClassRoom.objects.get(label=lesson_data['classroom']['label'])
            
            schedule.models.GroupLesson.objects.create(
                schedule=schedule_obj,
                number=lesson_data['number'],
                subgroup=lesson_data['subgroup'],
                major=major_obj,
                teacher=teacher_obj,
                classroom=classroom_obj
            )
        
        return schedule_obj
        print(group_obj)
        # Создаем расписание
        print(datetime.date.today())
        schedule_obj = schedule.models.Schedule.objects.get_or_create(group=group_obj, date=str(datetime.date.today()))
        print(schedule_obj)
        # Создаем уроки и связываем их с расписанием
        for lesson_data in lessons_data:
            print(lesson_data)
            major_obj = major.models.Major.objects.get(title=lesson_data['major']['title'])
            teacher_obj = users.models.User.objects.get(username=lesson_data['teacher']['username'])
            classroom_obj = schedule.models.ClassRoom.objects.get(label=lesson_data['classroom']['label'])
            
            schedule.models.GroupLesson.objects.create(
                schedule=schedule_obj[0],
                number=lesson_data['number'],
                subgroup=lesson_data['subgroup'],
                major=major_obj,
                teacher=teacher_obj,
                classroom=classroom_obj
            )
        
        return schedule