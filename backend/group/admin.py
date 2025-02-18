import django.contrib.admin
import group.models


@django.contrib.admin.register(group.models.Group)
class GroupAdmin(django.contrib.admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('name', )
    list_filter = ('name', )
    ordering = ('name',)
    fields = ('name',)
    search_fields = ("name", )