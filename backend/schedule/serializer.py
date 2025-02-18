import rest_framework.serializers

import schedule.models
import major.models
import users.serializer
import group.serializer
import major.serializer


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
