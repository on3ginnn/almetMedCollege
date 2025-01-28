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
    class Role(django.db.models.TextChoices):
        STUDENT = 'student', 'Студент'
        TEACHER = 'teacher', 'Преподаватель'
        ADMIN = 'admin', 'Администратор'

    role = django.db.models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT,
        blank=True, 
    )

    group = django.db.models.ForeignKey(
        'Group',
        null=True, 
        blank=True, 
        on_delete=django.db.models.SET_NULL,
        related_name='group_students',
    )  # Только для студентов

    def __str__(self):
        return self.get_full_name()
    
"""
    def save(self, *args, **kwargs):
       
        def log_get_queryset_items(self, qs):
            return [i.name for i in qs.all()]

        super().save(*args, **kwargs)  # Сохраняем пользователя для получения ID
        print(self.role)
        try:
            target_group = django.contrib.auth.models.Group.objects.get(name=self.role)
        except Group.DoesNotExist:
            raise ValueError(f"Группа с именем '{self.role}' не существует")


        print(log_get_queryset_items(self.groups))
        self.groups.clear()
        print(target_group)
        self.groups.add(target_group)
        print(log_get_queryset_items(self.groups))

        print(self.role)
        print(self.__dict__)
        super().save(*args, **kwargs)
        print(log_get_queryset_items(self.groups))

"""
        
    # TODO: дефолт пермишн задать надо