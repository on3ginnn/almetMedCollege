from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Applicant
from .serializer import ApplicantSerializer
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

    @action(detail=False, methods=["get"], url_path="rating")
    def rating(self, request):
        """
        GET /api/applicants/rating/
        Возвращает рейтинг абитуриентов по среднему баллу.
        До 50 человек на каждую специальность и тип поступления.
        """
        result = {
            "бюджет": {},
            "коммерция": {}
        }

        specialties = Applicant.objects.values_list("specialty", flat=True).distinct()

        for specialty in specialties:
            for admission_type in ["бюджет", "коммерция"]:
                applicants = Applicant.objects.filter(
                    specialty=specialty,
                    admission_type=admission_type
                ).order_by("-average_grade")[:50]
                serialized = ApplicantSerializer(applicants, many=True).data
                result[admission_type].setdefault(specialty, serialized)

        return Response(result)

    @action(detail=True, methods=['patch'])
    def document(self, request, pk):
        """
        PATCH /api/applicants/{id}/document/
        Обновить тип документов (оригинал, копия, не указано).
        """
        applicant = get_object_or_404(Applicant, pk=pk)
        documents_submitted = request.data.get('documents_submitted')
        if documents_submitted not in ['none', 'оригинал', 'копия']:
            return Response({'error': 'Invalid documents_submitted value'}, status=status.HTTP_400_BAD_REQUEST)
        applicant.documents_submitted = documents_submitted
        applicant.save()
        serializer = ApplicantSerializer(applicant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def admission_type(self, request, pk):
        """
        PATCH /api/applicants/{id}/admission_type/
        Обновить тип поступления (бюджет, коммерция, не указано).
        """
        applicant = get_object_or_404(Applicant, pk=pk)
        admission_type = request.data.get('admission_type')
        if admission_type not in ['none', 'бюджет', 'коммерция']:
            return Response({'error': 'Invalid admission_type value'}, status=status.HTTP_400_BAD_REQUEST)
        applicant.admission_type = admission_type
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