from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Applicant
from .serializer import ApplicantSerializer
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .utils import generate_application_docx, generate_applicants_excel, generate_application_titul
from rest_framework import status


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
    def rating_filtered(self, request):
        """
        GET /api/applicants/rating-filtered/?specialty=pharmacy&admission_type=бюджет
        Возвращает отсортированный список абитуриентов:
        - С documents_delivered=True
        - Сначала первоочередные (по среднему баллу)
        - Потом остальные (по среднему, наличию преимущественного права, дате подачи)
        """

        LIMITS = {
            ("medical_treatment", "бюджет"): 25,
            ("medical_treatment", "коммерция"): 10,
            ("medical_treatment_11", "бюджет"): 15,
            ("medical_treatment_11", "коммерция"): 10,
            ("midwifery", "бюджет"): 25,
            ("midwifery", "коммерция"): 10,
            ("nursing", "бюджет"): 50,
            ("nursing", "коммерция"): 50,
            ("nursing_zaochno", "коммерция"): 30,
            ("lab_diagnostics", "бюджет"): 15,
            ("lab_diagnostics", "коммерция"): 20,
            ("pharmacy", "коммерция"): 35,
        }

        specialty = request.query_params.get("specialty")
        admission_type = request.query_params.get("admission_type")

        if not specialty or not admission_type:
            return Response({"error": "specialty and admission_type are required."}, status=status.HTTP_400_BAD_REQUEST)

        key = (specialty, admission_type)
        limit = LIMITS.get(key)

        if not limit:
            return Response([], status=status.HTTP_200_OK)

        queryset = Applicant.objects.filter(
            specialty=specialty,
            admission_type=admission_type,
            documents_delivered=True,
        )
        # primary = queryset.exclude(priority_enrollment="none").order_by("-average_grade")[:limit]
        primary = queryset.exclude(priority_enrollment="none").order_by("-average_grade")
        # remaining_limit = limit - primary.count()

        others = queryset.filter(priority_enrollment="none").order_by(
            "-average_grade",
            "submitted_at"
        # )[:remaining_limit]
        )

        result = list(primary) + list(others)

        result_data = []
        for idx, applicant in enumerate(result):
            data = ApplicantSerializer(applicant).data
            data["in_limit"] = idx < limit
            result_data.append(data)

        # serializer = ApplicantSerializer(result, many=True)
        return Response(result_data)

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
    def study_form(self, request, pk):
        """
        PATCH /api/applicants/{id}/study_form/
        Обновить форму обучения (очная, очно-заочная).
        """
        applicant = get_object_or_404(Applicant, pk=pk)
        study_form = request.data.get('study_form')
        if study_form not in ['очная', 'очно-заочная']:
            return Response({'error': 'Invalid study_form value'}, status=status.HTTP_400_BAD_REQUEST)
        applicant.study_form = study_form
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
        if admission_type not in ['бюджет', 'коммерция']:
            return Response({'error': 'Invalid admission_type value'}, status=status.HTTP_400_BAD_REQUEST)
        applicant.admission_type = admission_type
        applicant.save()
        serializer = ApplicantSerializer(applicant)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["patch"], url_path="number")
    def number(self, request, pk=None):
        applicant = self.get_object()
        new_number = request.data.get("registration_number", "").strip()
        # if not new_number:
        #     return Response({"error": "Регистрационный номер не может быть пустым"}, status=status.HTTP_400_BAD_REQUEST)

        applicant.registration_number = new_number
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

def download_applicant_titul(request, pk):
    try:
        applicant = Applicant.objects.get(pk=pk)
        buffer = generate_application_titul(applicant)
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            content=buffer.getvalue(),
        )
        response['Content-Disposition'] = f'attachment; filename="Титульник_{applicant.full_name}.docx"'
        return response
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return HttpResponse(f"Ошибка: {str(e)}", status=500)


class DownloadExcelView(APIView):
    def get(self, request):
        buffer = generate_applicants_excel()
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            content=buffer.getvalue()
        )
        response['Content-Disposition'] = 'attachment; filename="applicants_delivered.xlsx"'
        return response