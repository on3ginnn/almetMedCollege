import django.db.models
import django.contrib.auth.models
import django.core.exceptions


class Group(django.db.models.Model):
    COURSE_CHOICES = [
        (1, "1 курс"),
        (2, "2 курс"),
        (3, "3 курс"),
        (4, "4 курс"),
    ]

    name = django.db.models.CharField(max_length=5, verbose_name="Название группы")
    course = django.db.models.IntegerField(choices=COURSE_CHOICES, verbose_name="Номер курса")

    class Meta:
        unique_together = ('name', 'course')  # Уникальность пары "название-курс"

    def clean(self):
        if self.course is None:
            raise django.core.exceptions.ValidationError("Номер курса обязателен для заполнения.")
        if self.course < 1 or self.course > 4:
            raise django.core.exceptions.ValidationError("Курс должен быть от 1 до 4")

    def __str__(self):
        return f"{self.name} ({self.get_course_display()})"
    

class User(django.contrib.auth.models.AbstractUser):
    # class Role(django.db.models.TextChoices):
    #     STUDENT = 'student', 'Student'
    #     TEACHER = 'teacher', 'Teacher'
    #     ADMIN = 'admin', 'Administrator'

    # role = django.db.models.CharField(
    #     max_length=10,
    #     choices=Role.choices,
    #     default=Role.STUDENT,
    # )

    group = django.db.models.ForeignKey(
        'Group',
        null=True, 
        blank=True, 
        on_delete=django.db.models.SET_NULL,
        related_name='group_students',
    )  # Только для студентов
