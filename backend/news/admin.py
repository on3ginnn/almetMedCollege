import django.forms
import django.contrib.admin
import news.models
import users.models


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
