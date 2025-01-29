import django.db.models
import django.contrib.auth.models
import django.core.exceptions
import group.models


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

    group = django.db.models.ForeignKey(
        group.models.Group,
        null=True, 
        blank=True, 
        on_delete=django.db.models.SET_NULL,
        related_name='group_students',
        verbose_name='группа',
    )  # Только для студентов

    def __str__(self):
        return self.get_full_name()

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"


