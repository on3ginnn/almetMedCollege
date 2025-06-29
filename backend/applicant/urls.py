from django.urls import path, include
import applicant.views
from rest_framework.routers import DefaultRouter

app_name = 'applicant'

router = DefaultRouter()
router.register('', applicant.views.ApplicantViewSet, basename='applicant')

urlpatterns = [
    path('download_excel/', applicant.views.DownloadExcelView.as_view(), name='download_excel'),

    path('', include(router.urls)),
    path('<int:pk>/download/', applicant.views.download_applicant_document, name='download_application'),
    path('<int:pk>/download/titul/', applicant.views.download_applicant_titul, name='download_application_titul'),
    path('<int:pk>/update_documents_delivered/', applicant.views.UpdateDocumentsDeliveredView.as_view(), name='update_documents_delivered'),
]
