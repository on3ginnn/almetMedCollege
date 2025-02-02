from django.db import models
from users.models import User
from group.models import Group


class Exercise(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название предмета")

    class Meta:
        verbose_name = "предмет"
        verbose_name_plural = "предметы"

    def __str__(self):
        return self.name


class Schedule(models.Model):
    date = models.DateField("Дата")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="schedules", verbose_name="Группа")

    class Meta:
        verbose_name = "расписание"
        verbose_name_plural = "расписания"
        unique_together = ('date', 'group')  # В один день у группы может быть только одно расписание
        ordering = ["date"]

    def __str__(self):
        return f"Расписание для {self.group} на {self.date}"


class GroupLesson(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name="lessons", verbose_name="Расписание")
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, verbose_name="Предмет")
    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={"role__in": [User.Role.TEACHER, User.Role.ADMIN]},
        verbose_name="Преподаватель",
    )
    number = models.PositiveIntegerField("Номер пары")  # Для порядка следования пар
    subgroup = models.ForeignKey(
        "group.SubGroup",
        on_delete=models.SET_NULL,
        null=True,  # Подгруппа может быть не выбрана (тогда расписание для всей группы)
        blank=True,
        verbose_name="Подгруппа",
    )

    class Meta:
        verbose_name = "пара"
        verbose_name = "пары"
        unique_together = ('schedule', 'number', 'subgroup')  # Теперь порядок внутри подгруппы разрешен
        ordering = ["number"]

    def __str__(self):
        return f"{self.number}. {self.exercise} ({self.teacher}) - {self.subgroup if self.subgroup else 'Вся группа'}"
