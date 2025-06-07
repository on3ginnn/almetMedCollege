from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Applicant
import applicant.serializer
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from .utils import generate_application_docx


class ApplicantViewSet(viewsets.ModelViewSet):
    """
    Полный CRUD для заявок абитуриентов.
    """
    queryset = Applicant.objects.all().order_by('-submitted_at')
    serializer_class = applicant.serializer.ApplicantSerializer

    # Фильтрация и поиск по ФИО, сортировка по среднему баллу и дате
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name']
    ordering_fields = ['average_grade', 'submitted_at']

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """
        POST /api/applicants/{id}/enroll/
        Пометить абитуриента как зачисленного.
        """
        applicant = get_object_or_404(Applicant, pk=pk)
        applicant.enrolled = True
        applicant.save()
        return Response({'status': 'зачислен'}, status=status.HTTP_200_OK)


def download_applicant_document(request, pk):
    applicant = Applicant.objects.get(pk=pk)
    buffer = generate_application_docx(applicant)
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content=buffer.getvalue(),
    )
    response['Content-Disposition'] = f'attachment; filename="Заявление_{applicant.full_name}.docx"'
    return response