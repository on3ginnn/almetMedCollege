import django.contrib.admin
import schedule.models


@django.contrib.admin.register(schedule.models.Exercise)
class ExerciseAdmin(django.contrib.admin.ModelAdmin):
    search_fields = ("name",)  # Нужно для работы autocomplete_fields


class GroupLessonInline(django.contrib.admin.TabularInline):  # Можно сделать StackedInline
    model = schedule.models.GroupLesson
    extra = 1
    ordering = ["number"]
    autocomplete_fields = ["exercise", "teacher"]
    

@django.contrib.admin.register(schedule.models.Schedule)
class ScheduleAdmin(django.contrib.admin.ModelAdmin):
    list_display = ("id", "group", "date")
    list_display_links = ("group", )
    list_filter = ("date", "group")
    ordering = ("date",)
    inlines = [GroupLessonInline]  # Позволяет сразу добавлять пары в расписание
