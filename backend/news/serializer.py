import secrets
import string

import django.contrib.auth
import rest_framework.serializers
import wonderwords

import news.models

USER_MODEL = django.contrib.auth.get_user_model()


class NewsSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = news.models.News
        fields = ['id', 'title', 'body', 'publisher', 'created_on', 'updated_on']
     

class NewsCreateUpdateSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = news.models.News
        fields = ['title', 'body', 'publisher']
