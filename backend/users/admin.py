from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
import users.models


@admin.register(users.models.Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'course')
    list_display_links = ('name', )
    list_filter = ('course',)
    search_fields = ('name',)
    ordering = ('course', 'name')
    fields = ('name', 'course')

    def has_add_permission(self, request):
        return request.user.is_staff


@admin.display(description="Полное имя")
def user_full_name(obj):
    return f"{obj.first_name} {obj.last_name}".capitalize()


@admin.register(users.models.User)
class CustomUserAdmin(UserAdmin):
    site_header = "Панель администрирования"
    # print(super().get_fieldsets(request))
    # print(get_fieldsets())

    fieldsets = (
        ('Учетные данные', {'fields': ('username', 'password')}), 
        ('Персональные данные', {'fields': ('first_name', 'last_name', 'role', 'email', 'group')}), 
        ('Доступ', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        ('Персональные данные', {'classes': ('wide',), 'fields': ('username', 'password1', 'password2', 'first_name', 'last_name', 'email', 'role', 'group')}), 
    )
    list_display = ('id', user_full_name, 'group', 'is_staff', 'is_active')
    list_display_links = ('id', user_full_name, )
    list_filter = ('groups', 'is_staff', 'is_active', 'group')
    search_fields = ('username', 'email')
    ordering = ('last_name', 'first_name', 'id')

    autocomplete_fields = ['groups']

    def save_related(self, request, form, formsets, change):
        """
        чтобы не сохранялись группы и пермишены через форму
        """
        pass
    # # Убрать возможность регистрации самим пользователям
    # def has_add_permission(self, request):
    #     return request.user.is_staff
