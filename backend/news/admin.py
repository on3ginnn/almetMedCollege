import django.contrib
import news.models


@django.contrib.admin.register(news.models.News)
class NewsAdmin(django.contrib.admin.ModelAdmin):
    list_display = ('id', 'title', 'get_publisher_full_name', 'created_on')
    list_display_links = ('title', )
    list_filter = ('created_on', )
    search_fields = ('title', )
    ordering = ('-created_on', )
    fields = ('title', 'body', 'publisher')

    autocomplete_fields = ['publisher']
