from django.urls import path, include
from rest_framework.routers import DefaultRouter
import applicant.views

app_name = 'applicant'

urlpatterns = [
    path('', applicant.views.ApplicantViewSet.as_view({'get': 'list'})),
    path('<int:pk>/download/', applicant.views.download_application, name='download_application'),

]
