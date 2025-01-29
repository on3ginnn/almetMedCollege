import django.contrib
import group.models


@django.contrib.admin.register(group.models.Group)
class GroupAdmin(django.contrib.admin.ModelAdmin):
    list_display = ('id', 'name', 'course')
    list_display_links = ('name', )
    list_filter = ('course', )
    ordering = ('course', 'name')
    fields = ('name', 'course')
