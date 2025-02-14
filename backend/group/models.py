import django.db.models
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
        verbose_name = "группа"
        verbose_name_plural = "группы"
        unique_together = ('name', 'course')  # Уникальность пары "название-курс"

    def clean(self):
        if self.course is None:
            raise django.core.exceptions.ValidationError("Номер курса обязателен для заполнения.")
        if self.course < 1 or self.course > 4:
            raise django.core.exceptions.ValidationError("Курс должен быть от 1 до 4")

    def __str__(self):
        return f"{self.name} ({self.get_course_display()})"
    

# class SubGroup(django.db.models.Model):
#     group = django.db.models.ForeignKey(Group, on_delete=django.db.models.CASCADE, related_name="subgroups", verbose_name="группа")
#     name = django.db.models.CharField(max_length=50, verbose_name="название подгруппы")

#     class Meta:
#         verbose_name = "подгруппа"
#         verbose_name_plural = "подгруппы"
#         unique_together = ('group', 'name')  # В одной группе имена подгрупп должны быть уникальны

#     def __str__(self):
#         return f"{self.group.name} ({self.name})"
