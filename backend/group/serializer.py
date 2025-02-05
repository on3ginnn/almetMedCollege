import secrets
import string

import django.contrib.auth
import rest_framework.serializers
import wonderwords

import group.models

USER_MODEL = django.contrib.auth.get_user_model()


class GroupSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = group.models.Group
        fields = ['id', 'name', 'course', 'group_students']
     

class GroupCreateSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = group.models.Group
        fields = ['name', 'course']


class GroupUpdateSerializer(rest_framework.serializers.ModelSerializer):
    """При изменение группы можно менять и ее состав"""
    group_students = rest_framework.serializers.PrimaryKeyRelatedField(
        queryset=USER_MODEL.objects.all(),
        many=True,
    )

    class Meta:
        model = group.models.Group
        fields = ['name', 'course', 'group_students']