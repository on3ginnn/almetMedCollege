from django.urls import path

import news.views


app_name = "news"

urlpatterns = [
    path('create/', news.views.NewsCreateAPIView.as_view(), name='create'),
    path('all/', news.views.NewsListAPIView.as_view(), name='list'),
    path('<int:pk>/', news.views.NewsDetailUpdateDeleteAPIView.as_view(), name='concrete'),
]
