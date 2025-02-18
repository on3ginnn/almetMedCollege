import django.contrib.admin
import django.urls
import backend.views
import django.conf

import users.urls
import group.urls
import news.urls
import schedule.urls


urlpatterns = [
    # django.urls.path(
    #     "admin/autocomplete/",  
    #     backend.views.CustomAutocompleteJsonView.as_view(admin_site=django.contrib.admin.site),
    #     name="ajax-autocomplete",
    # ),
    django.urls.path("user/", django.urls.include(users.urls)),
    django.urls.path("group/", django.urls.include(group.urls)),
    django.urls.path("news/", django.urls.include(news.urls)),
    django.urls.path("schedule/", django.urls.include(schedule.urls)),
    django.urls.path("admin/", django.contrib.admin.site.urls),
]


if django.conf.settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        django.urls.path("__debug__/", django.urls.include(debug_toolbar.urls)),
    ] + urlpatterns