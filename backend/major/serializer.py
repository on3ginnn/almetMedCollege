import secrets
import string

import django.contrib.auth
import rest_framework.serializers
import wonderwords

import major.models


class MajorSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = major.models.Major
        fields = ['id', 'title']
     

class MajorCreateUpdateSerializer(rest_framework.serializers.ModelSerializer):

    class Meta:
        model = major.models.Major
        fields = ['title']