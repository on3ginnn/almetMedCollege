from users.models import User
from group.models import Group
import django.db.models

import major.models


class ClassRoom(django.db.models.Model):
    label = django.db.models.CharField(max_length=255, unique=True, verbose_name="кабинет")

    class Meta:
        verbose_name = "кабинет"
        verbose_name_plural = "кабинеты"

    def __str__(self):
        return self.label


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

    schedule = django.db.models.ForeignKey(Schedule, on_delete=django.db.models.CASCADE, related_name="lessons", verbose_name="расписание")
    major = django.db.models.ForeignKey(major.models.Major, on_delete=django.db.models.SET_NULL, verbose_name="предмет", null=True)
    teacher = django.db.models.ForeignKey(
        User,
        on_delete=django.db.models.SET_NULL,
        null=True,
        limit_choices_to={"role__in": [User.Role.TEACHER, User.Role.ADMIN]},
        verbose_name="преподаватель",
    )
    classroom = django.db.models.ForeignKey(
        ClassRoom,
        verbose_name="кабинет",
        related_name="classroom",
        null=True,
        default=None,
        on_delete=django.db.models.SET_NULL,
    )

    number = django.db.models.CharField(
        "номер пары",
        choices=[
            ("n1", "1"),
            ("n2", "2"),
            ("n3", "3"),
            ("n4", "4"),
            ("n5", "5"),
            ("n6", "6"),
            ("n7", "7"),
        ],
        max_length=2,
    )
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
        unique_together = ('schedule', 'number', 'subgroup', 'classroom')
        ordering = ["number"]

    def __str__(self):
        return f"{self.number}. {self.major} ({self.teacher}) - {self.get_subgroup_display()}"
