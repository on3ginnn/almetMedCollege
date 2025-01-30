import django.forms
import django.contrib.admin
import news.models
import users.models


# class NewsAdminForm(django.forms.ModelForm):
#     """Форма для админки, ограничивающая выбор автора (publisher)"""

#     publisher = django.forms.ModelChoiceField(
#         queryset=users.models.User.objects.filter(role__in=[users.models.User.Role.TEACHER, users.models.User.Role.ADMIN]),
#         required=False,
#         label="Автор",
#     )

#     class Meta:
#         model = news.models.News
#         fields = '__all__'


@django.contrib.admin.register(news.models.News)
class NewsAdmin(django.contrib.admin.ModelAdmin):
    # form = NewsAdminForm  # Используем кастомную форму
    list_display = ('id', 'title', 'get_publisher_full_name', 'created_on')
    list_display_links = ('title', )
    list_filter = ('created_on', )
    search_fields = ('title', )
    ordering = ('-created_on', )
    fields = ('title', 'body', 'publisher')

    autocomplete_fields = ['publisher']  # Оставляем автозаполнение

    # def get_search_results(self, request, queryset, search_term):
    #     print("i'm here!")
    #     """
    #     Фильтруем пользователей в выпадающем списке, оставляя только преподавателей и администраторов.
    #     """
    #     queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        
    #     # Фильтруем только преподавателей и администраторов
    #     if request.GET.get('field_name') == 'publisher':
    #         queryset = queryset.filter(role__in=[users.models.User.Role.TEACHER, users.models.User.Role.ADMIN])
    #     print(queryset)
    #     return queryset, use_distinct