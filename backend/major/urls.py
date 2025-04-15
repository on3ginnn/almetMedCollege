import django.urls
import major.views


app_name = "major"

urlpatterns = [
    django.urls.path('create/', major.views.MajorCreateAPIView.as_view(), name='create'),
    django.urls.path('all/', major.views.MajorListAPIView.as_view(), name='list'),
    django.urls.path('<int:pk>/', major.views.MajorDetailUpdateDeleteAPIView.as_view(), name='concrete'),
]
