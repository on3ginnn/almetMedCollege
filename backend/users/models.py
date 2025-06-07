import django.db.models
import django.contrib.auth.models
import django.core.exceptions
import phonenumber_field.modelfields

import group.models
import major.models


class User(django.contrib.auth.models.AbstractUser):
    class Role(django.db.models.TextChoices):
        STUDENT = 'student', 'Студент'
        TEACHER = 'teacher', 'Преподаватель'
        ADMIN = 'admin', 'Администратор'

    role = django.db.models.CharField(
        "роль",
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT,
        blank=True, 
    )

    father_name = django.db.models.CharField(
        "отчество",
        max_length=50,
        blank=True,
        default="",
        null=True,
    )

    phone_number = phonenumber_field.modelfields.PhoneNumberField(
        "номер телефона",
        null=True,
        blank=True,
    )

    # REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"
        default_permissions = ('add', 'change', 'delete', 'view')

    def get_full_name(self):
        return '%s %s %s' % (self.last_name, self.first_name, self.father_name)

    def __str__(self):
        return self.get_full_name()


class TeacherInfo(django.db.models.Model):  # TODO: реализовать правильную архитектуру списковых полей
    user = django.db.models.OneToOneField(django.contrib.auth.get_user_model(), on_delete=django.db.models.CASCADE, related_name='teacher_info')
    subjects = django.db.models.TextField(verbose_name="преподаваемые дисциплины")
    education_level = django.db.models.TextField(verbose_name="уровень образования")
    qualification = django.db.models.TextField(verbose_name="квалификация")
    total_experience = django.db.models.PositiveIntegerField(verbose_name="общий стаж работы (лет)")
    teaching_experience = django.db.models.PositiveIntegerField(verbose_name="педагогический стаж (лет)")

    def __str__(self):
        return f"Доп.информация о преподавателе {self.user.get_full_name()}"
    

class StudentInfo(django.db.models.Model):
    user = django.db.models.OneToOneField(django.contrib.auth.get_user_model(), on_delete=django.db.models.CASCADE, related_name='student_info')
    major = django.db.models.ForeignKey(major.models.Major, related_name="major_students", on_delete=django.db.models.SET_NULL, null=True, verbose_name="специальность")
    group = django.db.models.ForeignKey(
        group.models.Group,
        null=True, 
        blank=True, 
        on_delete=django.db.models.SET_NULL,
        related_name='group_students',
        verbose_name='группа',
    )
    enrollment_date = django.db.models.DateField(verbose_name="дата зачисления", auto_now_add=True, null=True)

    def __str__(self):
        return f"Доп. информация о студенте {self.user.get_full_name()}"
