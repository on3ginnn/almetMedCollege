import django.urls
import schedule.views


app_name = "schedule"

urlpatterns = [
    django.urls.path('classroom/', schedule.views.ClassroomListAPIView.as_view(), name='classroom'),
    django.urls.path('create/', schedule.views.ScheduleCreateAPIView.as_view(), name='create'),
    django.urls.path('all/', schedule.views.ScheduleListAPIView.as_view(), name='list'),
    django.urls.path('<int:pk>/', schedule.views.ScheduleDetailUpdateDeleteAPIView.as_view(), name='concrete'),
    django.urls.path('', schedule.views.ScheduleDateGroup.as_view(), name='date-group'),
]
