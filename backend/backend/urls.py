import django.contrib.admin
import django.urls
import backend.views

import users.urls
import group.urls
import news.urls


urlpatterns = [
    # django.urls.path(
    #     "admin/autocomplete/",  
    #     backend.views.CustomAutocompleteJsonView.as_view(admin_site=django.contrib.admin.site),
    #     name="ajax-autocomplete",
    # ),
    django.urls.path("user/", django.urls.include(users.urls)),
    django.urls.path("group/", django.urls.include(group.urls)),
    django.urls.path("news/", django.urls.include(news.urls)),
    django.urls.path("admin/", django.contrib.admin.site.urls),
]
