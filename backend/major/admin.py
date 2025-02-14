import django.contrib

import major.models


@django.contrib.admin.register(major.models.Major)
class MajorAdmin(django.contrib.admin.ModelAdmin):
    list_display = ("id", "title")
    list_display_links = ("title", )
    ordering = ("title", )
    search_fields = ("title", )