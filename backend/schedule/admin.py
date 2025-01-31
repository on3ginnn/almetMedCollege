from django.contrib import admin
from .models import Schedule, GroupLesson, Exercise


class GroupLessonInline(admin.TabularInline):  # Можно сделать StackedInline
    model = GroupLesson
    extra = 1
    ordering = ["order"]
    autocomplete_fields = ["exercise", "teacher"]
    

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ("date", "group")
    list_filter = ("date", "group")
    ordering = ("date",)
    inlines = [GroupLessonInline]  # Позволяет сразу добавлять пары в расписание
