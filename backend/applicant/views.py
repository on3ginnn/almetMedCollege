from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Applicant
import applicant.serializer
from applicant.serializer import ApplicantSerializer
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from .utils import generate_application_docx, generate_applicants_excel
import openpyxl


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


class UpdateDocumentsDeliveredView(APIView):
    def patch(self, request, pk):
        try:
            applicant = Applicant.objects.get(pk=pk)
            print(applicant)
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
        # Generate Excel file
        buffer = generate_applicants_excel()
        
        # Create response
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            content=buffer.getvalue()
        )
        response['Content-Disposition'] = 'attachment; filename="applicants_delivered.xlsx"'
        return response