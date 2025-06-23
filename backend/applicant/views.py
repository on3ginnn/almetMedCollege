from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Applicant
from .serializer import ApplicantSerializer  # Fix import
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .utils import generate_application_docx, generate_applicants_excel

class ApplicantViewSet(viewsets.ModelViewSet):
    """
    Полный CRUD для заявок абитуриентов.
    """
    queryset = Applicant.objects.all().order_by('-submitted_at')
    serializer_class = ApplicantSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name']
    ordering_fields = ['average_grade', 'submitted_at']

    @action(detail=True, methods=['patch'])
    def enroll(self, request, pk=None):
        """
        PATCH /api/applicants/{id}/enroll/
        Пометить абитуриента как зачисленного.
        """
        applicant = get_object_or_404(Applicant, pk=pk)
        applicant.enrolled = True
        applicant.save()
        serializer = ApplicantSerializer(applicant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def document(self, request, pk):
        """
        PATCH /api/applicants/{id}/document/
        Обновить тип документов (оригинал, копия, null).
        """
        applicant = get_object_or_404(Applicant, pk=pk)
        documents_submitted = request.data.get('documents_submitted')
        if documents_submitted not in [None, 'оригинал', 'копия']:
            return Response({'error': 'Invalid documents_submitted value'}, status=status.HTTP_400_BAD_REQUEST)
        applicant.documents_submitted = documents_submitted
        applicant.save()
        serializer = ApplicantSerializer(applicant)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateDocumentsDeliveredView(APIView):
    def patch(self, request, pk):
        try:
            applicant = Applicant.objects.get(pk=pk)
        except Applicant.DoesNotExist:
            return Response({'error': 'Applicant not found'}, status=status.HTTP_404_NOT_FOUND)
        documents_delivered = request.data.get('documents_delivered')
        if documents_delivered is None:
            return Response({'error': 'documents_delivered field is required'}, status=status.HTTP_400_BAD_REQUEST)
        applicant.documents_delivered = documents_delivered
        applicant.save()
        serializer = ApplicantSerializer(applicant)
        return Response(serializer.data, status=status.HTTP_200_OK)

def download_applicant_document(request, pk):
    applicant = Applicant.objects.get(pk=pk)
    buffer = generate_application_docx(applicant)
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content=buffer.getvalue(),
    )
    response['Content-Disposition'] = f'attachment; filename="Заявление_{applicant.full_name}.docx"'
    return response

class DownloadExcelView(APIView):
    def get(self, request):
        buffer = generate_applicants_excel()
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            content=buffer.getvalue()
        )
        response['Content-Disposition'] = 'attachment; filename="applicants_delivered.xlsx"'
        return response