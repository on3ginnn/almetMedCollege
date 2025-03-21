import secrets
import string

import django.contrib.auth
import rest_framework
import wonderwords

USER_MODEL = django.contrib.auth.get_user_model()


class UserSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = USER_MODEL     
        fields = ['id', 'username', "first_name", "last_name", 'father_name', 'phone_number', "phone_number", "role"]
    

class UserListWithPasswordSerializer(rest_framework.serializers.ModelSerializer):
    class Meta:
        model = USER_MODEL
        fields = ['id', 'username', 'password', "last_name", "first_name", "father_name", "phone_number", "role"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        print(data['password'])

        return data

class UserCreateSerializer(rest_framework.serializers.ModelSerializer):
    # email = rest_framework.serializers.EmailField()
    
    class Meta:
        model = USER_MODEL
        fields = ['first_name', 'last_name', 'father_name', 'phone_number', 'role']

    def generate_unique_username(self):
        r = wonderwords.RandomWord()
        while True:
            username = r.word(include_parts_of_speech=["nouns"])
            if not USER_MODEL.objects.filter(username=username).exists():
                return username
            
    def generate_password(self, length=8):
        if length < 4:
            raise ValueError("Длина пароля должна быть не менее 4 символов.")
        
        # Определяем наборы символов
        lowercase = string.ascii_lowercase
        uppercase = string.ascii_uppercase
        digits = string.digits
        
        # Гарантируем наличие хотя бы одного символа из каждого набора
        password = [
            secrets.choice(lowercase),
            secrets.choice(uppercase),
            secrets.choice(digits)
        ]
        
        # Заполняем оставшиеся символы случайным выбором из всех наборов
        all_characters = lowercase + uppercase + digits
        password += [secrets.choice(all_characters) for _ in range(length - 3)]
        
        # Перемешиваем символы для повышения безопасности
        secrets.SystemRandom().shuffle(password)
        
        return ''.join(password)

    def create(self, validated_data):
        username = self.generate_unique_username()
        password = self.generate_password()  # Генерируем пароль
        user = USER_MODEL(
            username=username,
            password=password,
            **validated_data
        )
        print(password)
        # user.set_password(password)  # Устанавливаем сгенерированный пароль
        user.save()
        return user
    
    def validate_password(self, value):
        if len(value) < 8:
            raise rest_framework.serializers.ValidationError("Пароль должен быть не менее 8 символов.")
        
        if not any(char.islower() for char in value):
            raise rest_framework.serializers.ValidationError("Пароль должен содержать хотя бы одну строчную букву.")
        
        if not any(char.isupper() for char in value):
            raise rest_framework.serializers.ValidationError("Пароль должен содержать хотя бы одну заглавную букву.")
        
        if not any(char.isdigit() for char in value):
            raise rest_framework.serializers.ValidationError("Пароль должен содержать хотя бы одну цифру.")
        
        return value
        return django.contrib.auth.hashers.make_password(value)


class UserUpdateSerializer(rest_framework.serializers.ModelSerializer):

    class Meta:
        model = USER_MODEL
        fields = ['username', 'password', "first_name", "last_name", 'father_name', 'phone_number', "email", "role"]
