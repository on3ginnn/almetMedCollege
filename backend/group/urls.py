import django.urls
import group.views


app_name = "group"

urlpatterns = [
    django.urls.path('create/', group.views.GroupCreateAPIView.as_view(), name='create'),
    django.urls.path('all/', group.views.GroupListAPIView.as_view(), name='list'),
    django.urls.path('<int:pk>/', group.views.GroupDetailUpdateDeleteAPIView.as_view(), name='concrete'),
]
