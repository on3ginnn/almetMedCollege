from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Applicant
import applicant.serializer
from django.shortcuts import get_object_or_404
from django.http import FileResponse
# from generate_applicant_docx import generate_application_docx


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all().order_by('-submitted_at')
    serializer_class = applicant.serializer.ApplicantSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name']
    ordering_fields = ['average_grade', 'submitted_at']

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        applicant = self.get_object()
        applicant.enrolled = True
        applicant.save()
        return Response({'status': 'enrolled'})


def download_application(request, pk):
    applicant = get_object_or_404(Applicant, pk=pk)
    file_buffer = generate_application_docx(applicant)
    response = FileResponse(file_buffer, as_attachment=True, filename='Заявление_абитуриента.docx')
    return response
