from django.urls import path
import group.views


app_name = "group"

urlpatterns = [
    path('create/', group.views.GroupCreateAPIView.as_view(), name='create'),
    path('all/', group.views.GroupListAPIView.as_view(), name='list'),
    path('<int:pk>/', group.views.GroupDetailUpdateDeleteAPIView.as_view(), name='concrete'),
]
