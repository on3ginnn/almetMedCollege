from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
import users.models


@admin.display(description="Полное имя")
def user_full_name(obj):
    return f"{obj.first_name} {obj.last_name}".capitalize()


@admin.register(users.models.User)
class CustomUserAdmin(UserAdmin):
    site_header = "Панель администрирования"

    fieldsets = (
        ('Учетные данные', {'fields': ('username', 'password')}), 
        ('Персональные данные', {'fields': ('first_name', 'last_name', 'father_name', 'phone_number', 'role', 'email', 'group')}), 
        ('Доступ', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        ('Персональные данные', {'classes': ('wide',), 'fields': ('username', 'password1', 'password2', 'first_name', 'last_name', 'father_name', 'phone_number', 'role', 'group')}), 
    )
    list_display = ('id', user_full_name, 'group', 'is_staff', 'is_active')
    list_display_links = ('id', user_full_name, )
    list_filter = ('groups', 'is_staff', 'is_active', 'group')
    search_fields = ('last_name', 'first_name')  # используется для autocomplete_fields в связанных моделях
    ordering = ('last_name', 'first_name', 'id')

    autocomplete_fields = ['groups', 'group']

    def save_related(self, request, form, formsets, change):
        """
        чтобы не сохранялись группы и пермишены через форму
        """
        pass
 
    def get_search_results(self, request, queryset, search_term):
        """
        Фильтруем пользователей в выпадающем списке, оставляя только преподавателей и администраторов.
        """
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        
        # Фильтруем только преподавателей и администраторов
        if request.GET.get('field_name') == 'publisher':
            queryset = queryset.filter(role__in=[users.models.User.Role.TEACHER, users.models.User.Role.ADMIN])

        return queryset, use_distinct