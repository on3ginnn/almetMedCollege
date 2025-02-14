import django.contrib.admin
import group.models


@django.contrib.admin.register(group.models.Group)
class GroupAdmin(django.contrib.admin.ModelAdmin):
    list_display = ('id', 'name', 'course')
    list_display_links = ('name', )
    list_filter = ('course', )
    ordering = ('course', 'name')
    fields = ('name', 'course')
    search_fields = ("name", )
    

# @django.contrib.admin.register(group.models.SubGroup)
# class SubGroupAdmin(django.contrib.admin.ModelAdmin):
#     list_display = ('id', 'name', 'group')
#     list_display_links = ('name', )
#     list_filter = ('group', )
#     ordering = ('group', 'name')
#     fields = ('name', 'group')

#     autocomplete_fields = ["group"]