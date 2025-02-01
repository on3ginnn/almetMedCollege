import django.contrib.admin
import schedule.models


class GroupLessonInline(django.contrib.admin.TabularInline):  # Можно сделать StackedInline
    model = schedule.models.GroupLesson
    extra = 1
    ordering = ["number"]
    # autocomplete_fields = ["exercise", "teacher"]
    

@django.contrib.admin.register(schedule.models.Schedule)
class ScheduleAdmin(django.contrib.admin.ModelAdmin):
    list_display = ("date", "group")
    list_filter = ("date", "group")
    ordering = ("date",)
    inlines = [GroupLessonInline]  # Позволяет сразу добавлять пары в расписание
