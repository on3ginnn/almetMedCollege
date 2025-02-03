import django.contrib.admin
import django.urls
import backend.views

import users.urls


urlpatterns = [
    # django.urls.path(
    #     "admin/autocomplete/",  
    #     backend.views.CustomAutocompleteJsonView.as_view(admin_site=django.contrib.admin.site),
    #     name="ajax-autocomplete",
    # ),
    django.urls.path("user/", django.urls.include(users.urls)),
    django.urls.path("admin/", django.contrib.admin.site.urls),
]
