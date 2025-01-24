import re

from rest_framework import serializers
import django.contrib.auth


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = django.contrib.auth.get_user_model()
        fields = ['id', 'username', 'email']
     

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    
    class Meta:
        model = django.contrib.auth.get_user_model()
        fields = ['username', 'email', 'password']

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен быть не менее 8 символов.")
        
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну строчную букву.")
        
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну заглавную букву.")
        
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну цифру.")
        
        if not re.search(r"[@#$%^&*]", value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы один специальный символ (@#$%^&*).")
        
        return django.contrib.auth.hashers.make_password(value)


class LoginSerializer(serializers.Serializer):

    class Meta:
        model = django.contrib.auth.get_user_model()
        fields = ['username', 'password']