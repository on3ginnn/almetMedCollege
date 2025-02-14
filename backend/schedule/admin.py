import django.contrib.admin

import schedule.models


@django.contrib.admin.register(schedule.models.ClassRoom)
class ClassRoomAdmin(django.contrib.admin.ModelAdmin):
    list_display = ("id", "label")
    list_display_links = ("label", )
    ordering = ("label",)
    search_fields = ("label",)

class GroupLessonInline(django.contrib.admin.TabularInline):  # Можно сделать StackedInline
    model = schedule.models.GroupLesson
    extra = 1
    ordering = ["number"]
    autocomplete_fields = ["major", "classroom", "teacher"]
    

@django.contrib.admin.register(schedule.models.Schedule)
class ScheduleAdmin(django.contrib.admin.ModelAdmin):
    list_display = ("id", "group", "date")
    list_display_links = ("group", )
    list_filter = ("date", "group")
    ordering = ("date",)
    # autocomplete_fields = ("classroom",)
    inlines = [GroupLessonInline]  # Позволяет сразу добавлять пары в расписание
