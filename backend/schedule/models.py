from users.models import User
from group.models import Group
import django.db


class Exercise(django.db.models.Model):
    name = django.db.models.CharField(max_length=255, unique=True, verbose_name="Название предмета")

    class Meta:
        verbose_name = "предмет"
        verbose_name_plural = "предметы"

    def __str__(self):
        return self.name


class Schedule(django.db.models.Model):
    date = django.db.models.DateField("Дата")
    group = django.db.models.ForeignKey(Group, on_delete=django.db.models.CASCADE, related_name="schedules", verbose_name="Группа")

    class Meta:
        verbose_name = "расписание"
        verbose_name_plural = "расписания"
        unique_together = ('date', 'group')  # В один день у группы может быть только одно расписание
        ordering = ["date"]

    def __str__(self):
        return f"Расписание для {self.group} на {self.date}"


class GroupLesson(django.db.models.Model):
    class SubGroups(django.db.models.TextChoices):
        ALL = 'all', 'Общая'
        FIRST_SUBGROUP = 'first_subgroup', '1п/г'
        SECONT_SUBGROUP = 'second_subgroup', '2п/г'
        ONE_BRIGADE = 'first_brigade', '1 бригада'
        SECOND_BRIGADE = 'second_brigade', '2 бригада'
        THIRD_BRIGADE = 'third_brigade', '3 бригада'

    schedule = django.db.models.ForeignKey(Schedule, on_delete=django.db.models.CASCADE, related_name="lessons", verbose_name="Расписание")
    exercise = django.db.models.ForeignKey(Exercise, on_delete=django.db.models.CASCADE, verbose_name="Предмет")
    teacher = django.db.models.ForeignKey(
        User,
        on_delete=django.db.models.SET_NULL,
        null=True,
        limit_choices_to={"role__in": [User.Role.TEACHER, User.Role.ADMIN]},
        verbose_name="Преподаватель",
    )
    number = django.db.models.PositiveIntegerField("Номер пары")  # Для порядка следования пар
    subgroup = django.db.models.CharField(
        "подгруппа",
        max_length=15,
        choices=SubGroups.choices,
        default=SubGroups.ALL,
        blank=True, 
    )

    class Meta:
        verbose_name = "пара"
        verbose_name = "пары"
        unique_together = ('schedule', 'number', 'subgroup')  # Теперь порядок внутри подгруппы разрешен
        ordering = ["number"]

    def __str__(self):
        return f"{self.number}. {self.exercise} ({self.teacher}) - {self.get_subgroup_display()}"
