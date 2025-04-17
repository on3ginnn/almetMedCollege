import django.contrib.admin
import django.urls
import backend.views
import django.conf

import users.urls
import users.views
import group.urls
import news.urls
import schedule.urls
import major.urls


urlpatterns = [
    django.urls.path('login/', users.views.UserLoginAPIView.as_view(), name='login'),
    django.urls.path("logout/", users.views.UserLogoutAPIView.as_view(), name="logout"),

    django.urls.path("user/", django.urls.include(users.urls)),
    django.urls.path("group/", django.urls.include(group.urls)),
    django.urls.path("news/", django.urls.include(news.urls)),
    django.urls.path("schedule/", django.urls.include(schedule.urls)),
    django.urls.path("major/", django.urls.include(major.urls)),
    django.urls.path("admin/", django.contrib.admin.site.urls),
]


if django.conf.settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        django.urls.path("__debug__/", django.urls.include(debug_toolbar.urls)),
    ] + urlpatterns