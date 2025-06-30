from docxtpl import DocxTemplate
from django.http import HttpResponse
from django.template.defaultfilters import date as _date
import io
from datetime import datetime
from .models import Applicant
from io import BytesIO
from collections import defaultdict
from openpyxl import Workbook
from django.db import models


def _date(date_obj, format_str='d.m.Y'):
    """Helper function to format dates."""
    return date_obj.strftime(format_str) if date_obj else ''

def generate_applicants_excel():
    try:
        # Fetch applicants with documents delivered, ordered by specialty
        applicants = Applicant.objects.filter(documents_delivered=True).order_by('specialty')
        
        # Group applicants by specialty
        specialty_groups = defaultdict(list)
        for applicant in applicants:
            specialty_key = applicant.specialty
            specialty_groups[specialty_key].append(applicant)
        
        # Initialize workbook and remove default sheet
        wb = Workbook()
        wb.remove(wb.active)

        # Define headers based on Applicant model
        headers = [
            'Рег.номер', 'Специальность', 'ФИО', 'Гражданство', 'Национальность',
            'Дата рождения', 'Место рождения', 'Адрес местожительства', 'Фактический адрес',
            'Серия, № аттестата', 'Дата выдачи аттестата', 'Год окончания, наименование учебного заведения',
            'Паспортные данные (серия, номер, кем и когда выдан)', 'Код подразделения', 'Дата регистрации прописки',
            'ИНН', 'СНИЛС', 'Медицинский полис', 'Приписное свидетельство', 'Договор с мед.организацией',
            'Телефон абитуриента', 'Email',
            'ФИО, № телефона представителя 1', 'Место работы, должность представителя 1', 'Паспортные данные представителя 1',
            'ФИО, № телефона представителя 2', 'Место работы, должность представителя 2', 'Паспортные данные представителя 2',
            'Русский язык', 'Биология', 'Химия', 'Математика', 'Иностранный язык', 'Физика', 'Средний балл',
            'Бюджет/коммерция', 'Нуждается в общежитии', 'Тип поданных документов', 'Форма обучения',
            'Первоочередное зачисление', 'Преимущественное право на зачисление'
        ]

        # Map choices for display
        specialty_map = dict(Applicant.SPECIALTY_CHOICES)
        priority_enrollment_map = dict(Applicant.PRIORITY_ENROLLMENT_CHOICES)
        preferential_enrollment_map = dict(Applicant.PREFERENTIAL_ENROLLMENT_CHOICES)
        study_form_map = dict(Applicant.STUDY_FORM_CHOICES)
        admission_type_map = dict(Applicant.ADMISSION_TYPE_CHOICES)
        documents_type_map = dict(Applicant.DOCUMENTS_TYPE_CHOICES)

        for specialty_key, applicants in specialty_groups.items():
            # Get display name for specialty
            specialty_name = specialty_map.get(specialty_key, specialty_key)

            # Sanitize sheet name for Excel (max 31 chars, no invalid chars)
            sheet_name = specialty_name[:31].replace('/', '_').replace('\\', '_').replace('?', '').replace('*', '').replace('[', '').replace(']', '').strip()

            # Create worksheet
            ws = wb.create_sheet(title=sheet_name)
            ws.append(headers)

            for applicant in applicants:
                # Combine graduation info
                graduation_info = (
                    f"{applicant.graduation_year}, {applicant.graduation_institution}"
                    if applicant.graduation_year and applicant.graduation_institution else ''
                )

                # Combine passport data
                passport_data = (
                    f"{applicant.passport_series} {applicant.passport_number}, "
                    f"{applicant.passport_issued_by}, {_date(applicant.passport_issued_date, 'd.m.Y')}"
                    if all([applicant.passport_series, applicant.passport_number, applicant.passport_issued_by, applicant.passport_issued_date])
                    else ''
                )

                # Combine representative info
                representative1_info = (
                    f"{applicant.representative1_name}, {applicant.representative1_phone}"
                    if applicant.representative1_name and applicant.representative1_phone else ''
                )
                representative2_info = (
                    f"{applicant.representative2_name}, {applicant.representative2_phone}"
                    if applicant.representative2_name and applicant.representative2_phone else ''
                )

                # Combine representative passport data
                representative1_passport = (
                    f"Серия: {applicant.representative1_passport_series} № {applicant.representative1_passport_number}, "
                    f"выдан: {applicant.representative1_passport_issued_by}, {_date(applicant.representative1_passport_issued_date, 'd.m.Y')}"
                    if all([applicant.representative1_passport_series, applicant.representative1_passport_number,
                            applicant.representative1_passport_issued_by, applicant.representative1_passport_issued_date])
                    else ''
                )
                representative2_passport = (
                    f"Серия: {applicant.representative2_passport_series} № {applicant.representative2_passport_number}, "
                    f"выдан: {applicant.representative2_passport_issued_by}, {_date(applicant.representative2_passport_issued_date, 'd.m.Y')}"
                    if all([applicant.representative2_passport_series, applicant.representative2_passport_number,
                            applicant.representative2_passport_issued_by, applicant.representative2_passport_issued_date])
                    else ''
                )

                # Construct row
                row = [
                    applicant.registration_number or '',
                    specialty_name,
                    applicant.full_name or '',
                    applicant.citizenship or '',
                    applicant.nationality or '',
                    _date(applicant.birth_date, 'd.m.Y') if applicant.birth_date else '',
                    applicant.birth_place or '',
                    applicant.address or '',
                    applicant.address_actual or '',
                    applicant.certificate_series or '',
                    _date(applicant.certificate_issued_date, 'd.m.Y') if applicant.certificate_issued_date else '',
                    graduation_info,
                    passport_data,
                    applicant.passport_division_code or '',
                    _date(applicant.passport_registration_date, 'd.m.Y') if applicant.passport_registration_date else '',
                    applicant.inn or '',
                    applicant.snils or '',
                    applicant.medical_policy or '',
                    'Да' if applicant.military_id else 'Нет',
                    'Да' if applicant.medical_contract else 'Нет',
                    applicant.student_phone or '',
                    applicant.student_email or '',
                    representative1_info,
                    applicant.representative1_job or '',
                    representative1_passport,
                    representative2_info,
                    applicant.representative2_job or '',
                    representative2_passport,
                    str(applicant.grade_russian) if applicant.grade_russian else '',
                    str(applicant.grade_biology) if applicant.grade_biology else '',
                    str(applicant.grade_chemistry) if applicant.grade_chemistry else '',
                    str(applicant.grade_math) if applicant.grade_math else '',
                    str(applicant.grade_language) if applicant.grade_language else '',
                    str(applicant.grade_physics) if applicant.grade_physics else '',
                    str(applicant.average_grade) if applicant.average_grade else '',
                    admission_type_map.get(applicant.admission_type, '') if applicant.admission_type else '',
                    'Да' if applicant.needs_dormitory else 'Нет',
                    documents_type_map.get(applicant.documents_submitted, '') if applicant.documents_submitted else '',
                    study_form_map.get(applicant.study_form, '') if applicant.study_form else '',
                    priority_enrollment_map.get(applicant.priority_enrollment, '') if applicant.priority_enrollment else '',
                    preferential_enrollment_map.get(applicant.preferential_enrollment, '') if applicant.preferential_enrollment else ''
                ]

                ws.append(row)

        # Handle case with no applicants
        if not specialty_groups:
            ws = wb.create_sheet(title="No Applicants")
            ws.append(headers)
            ws.append(['Нет абитуриентов с сданными документами'])

        # Save to BytesIO buffer for download
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return buffer

    except Exception as e:
        # Log the error for debugging (you can replace with your logging mechanism)
        print(f"Error generating Excel: {str(e)}")
        raise


def generate_application_docx(applicant: Applicant):
    template_path = 'static/docx/applicant.docx'
    doc = DocxTemplate(template_path)

    # Split full_name into parts
    name_parts = applicant.full_name.split() if applicant.full_name else ['', '', '']
    last_name = name_parts[0] if len(name_parts) > 0 else ''
    first_name = name_parts[1] if len(name_parts) > 1 else ''
    father_name = name_parts[2] if len(name_parts) > 2 else ''

    # Map specialty to human-readable form
    # specialty_map = {
    #     'pharmacy': 'Фармация',
    #     'nursing': f'Сестринское дело ({dict(Applicant.EDUCATION_BASE_CHOICES).get(applicant.education_base, "")})',
    #     'midwifery': 'Акушерское дело',
    #     'lab_diagnostics': 'Лабораторная диагностика',
    #     'medical_treatment': 'Лечебное дело',
    # }
    # specialty = specialty_map.get(applicant.specialty, '')
    specialty = dict(Applicant.SPECIALTY_CHOICES).get(applicant.specialty, '')

    # Clean SNILS
    clean_snils = applicant.snils.replace('-', '').replace(' ', '') if applicant.snils else ''

    # Format representative passport details
    representative1_passport = (
        f'Серия: {applicant.representative1_passport_series} № {applicant.representative1_passport_number}, '
        f'выдан: {applicant.representative1_passport_issued_by}, {_date(applicant.representative1_passport_issued_date, "d.m.Y")}'
        if all([applicant.representative1_passport_series, applicant.representative1_passport_number, 
                applicant.representative1_passport_issued_by, applicant.representative1_passport_issued_date])
        else '''______________________________________________
_________________________________________________________________________________________
'''
    )
    representative2_passport = (
        f'Серия: {applicant.representative2_passport_series} № {applicant.representative2_passport_number}, '
        f'выдан: {applicant.representative2_passport_issued_by}, {_date(applicant.representative2_passport_issued_date, "d.m.Y")}'
        if all([applicant.representative2_passport_series, applicant.representative2_passport_number, 
                applicant.representative2_passport_issued_by, applicant.representative2_passport_issued_date])
        else '''______________________________________________
_________________________________________________________________________________________
'''
    )

    # Determine social benefits
    benefits_enrollment = 'Нет' if applicant.priority_enrollment == 'none' and applicant.preferential_enrollment == 'none' else 'Да'

    # Calculate average grade dynamically
    grades = [grade for grade in [applicant.grade_russian, applicant.grade_biology, applicant.grade_chemistry] if grade is not None]
    average_grade = sum(grades) / len(grades) if grades else ''

    # Context for template rendering
    context = {
        'registration_number': applicant.registration_number or '_____________________',
        'last_name': last_name,
        'first_name': first_name,
        'father_name': father_name or '__________________',
        'birth_date': _date(applicant.birth_date, 'd.m.Y') if applicant.birth_date else '',
        'birth_place': applicant.birth_place or '''_______________________
______________________________________
''',
        'citizenship': applicant.citizenship or '___________________________',
        'passport_series': applicant.passport_series or '______',
        'passport_number': applicant.passport_number or '_____________',
        'passport_issued_date': _date(applicant.passport_issued_date, 'd.m.Y') if applicant.passport_issued_date else '___________________________',
        'passport_issued_by': applicant.passport_issued_by or '''_____________________________
_______________________________________

''',
        'passport_division_code': applicant.passport_division_code or '__________',
        'address': applicant.address or '_____________________________________________________________________________________',
        'address_actual': applicant.address_actual or applicant.address or 'тот же',
        'passport_registration_date': _date(applicant.passport_registration_date, 'd.m.Y') if applicant.passport_registration_date else '',
        'snils': clean_snils,
        'inn': applicant.inn or '___________________',
        'medical_policy': applicant.medical_policy or '',
        'military_id': 'Да' if applicant.military_id else 'Нет',
        'student_phone': applicant.student_phone or '____________________',
        'email': applicant.student_email or '______________________________________',
        'specialty': specialty,
        'study_form_verbose': dict(Applicant.STUDY_FORM_CHOICES).get(applicant.study_form, ''),
        'documents_submitted': applicant.documents_submitted or '',
        'admission_type': dict(Applicant.ADMISSION_TYPE_CHOICES).get(applicant.admission_type, ''),
        'graduation_year': str(applicant.graduation_year) if applicant.graduation_year else '__________',
        'graduation_institution': applicant.graduation_institution or '''__________________________________________________________________________________________________________________________________________________________________________''',
        'certificate_series': applicant.certificate_series or '___________________',
        'certificate_issued_date': _date(applicant.certificate_issued_date, 'd.m.Y') if applicant.certificate_issued_date else '_________________________',
        # 'average_grade': str(average_grade) if average_grade else '_________________________',
        'average_grade': str(applicant.average_grade),
        'grade_russian': str(applicant.grade_russian) if applicant.grade_russian else '___________________',
        'grade_biology': str(applicant.grade_biology) if applicant.grade_biology else '_________________________',
        'grade_chemistry': str(applicant.grade_chemistry) if applicant.grade_chemistry else '____________________________',
        'benefits_enrollment': benefits_enrollment,
        'needs_dormitory': 'нуждаюсь' if applicant.needs_dormitory else 'не нуждаюсь',
        'representative1_fio': applicant.representative1_name or '''________________________________________________________
_________________________________________________________________________________________
''',
        'representative1_job': applicant.representative1_job or '___________________________________________________________________',
        'representative1_phone': applicant.representative1_phone or '_______________________________________________________________________',
        'representative1_passport': representative1_passport,
        'representative2_fio': applicant.representative2_name or '___________________________________________________________',
        'representative2_job': applicant.representative2_job or '___________________________________________________________________',
        'representative2_phone': applicant.representative2_phone or '________________________________________________________________________',
        'representative2_passport': representative2_passport,
        'current_date': _date(datetime.now(), 'd F Y'),
        'applicant_signature': '',
        'commission_signature': '',
    }

    # Render the template with the context
    doc.render(context)

    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer


def generate_application_titul(applicant: Applicant):
    template_path = 'static/docx/applicant_titul.docx'
    doc = DocxTemplate(template_path)

    # Карта специальностей
    # specialty_map = {
    #     'pharmacy': 'Фармация',
    #     'nursing': f'Сестринское дело ({dict(Applicant.EDUCATION_BASE_CHOICES).get(applicant.education_base, "")})',
    #     'midwifery': 'Акушерское дело',
    #     'lab_diagnostics': 'Лабораторная диагностика',
    #     'medical_treatment': 'Лечебное дело',
    # }

    # specialty = specialty_map.get(applicant.specialty, '')
    specialty = dict(Applicant.SPECIALTY_CHOICES).get(applicant.specialty, '')
    clean_snils = applicant.snils.replace('-', '').replace(' ', '') if applicant.snils else ''

    # Представители
    mother_info = f"{applicant.representative1_name or ''}, {applicant.representative1_phone or ''}".strip(', ')
    father_info = f"{applicant.representative2_name or ''}, {applicant.representative2_phone or ''}".strip(', ')

    # Паспорт
    passport_info = ''
    if applicant.passport_series and applicant.passport_number:
        passport_info += f"Серия: {applicant.passport_series} № {applicant.passport_number}, "
    if applicant.passport_issued_by:
        passport_info += f"{applicant.passport_issued_by}, "
    if applicant.passport_issued_date:
        passport_info += f"{_date(applicant.passport_issued_date, 'd.m.Y')}"

    # Дата окончания + учреждение
    graduation_info = ''
    if applicant.graduation_year or applicant.graduation_institution:
        graduation_info = f"{applicant.graduation_year or ''}, {applicant.graduation_institution or ''}".strip(', ')

    # Средний балл
    grades = [g for g in [applicant.grade_russian, applicant.grade_biology, applicant.grade_chemistry] if g is not None]
    average_grade = f"{(sum(grades) / len(grades)):.2f}" if grades else ''

    # Контекст
    context = {
        'registration_number': applicant.registration_number or '',
        'specialty': specialty,
        'full_name': applicant.full_name,
        'citizenship': applicant.citizenship or '',
        'nationality': applicant.nationality or '',
        'birth_date': _date(applicant.birth_date, 'd.m.Y'),
        'birth_place': applicant.birth_place or '',
        'address_actual': applicant.address_actual,

        'certificate_series': applicant.certificate_series or '',
        'graduation_info': graduation_info,

        'passport': passport_info or '',
        'inn': applicant.inn or '',
        'snils': clean_snils,
        'medical_policy': applicant.medical_policy or '',
        'military_id': 'Да' if applicant.military_id else 'Нет',
        'student_phone': applicant.student_phone or '',

        'mother': mother_info,
        'mother_job': applicant.representative1_job or '',
        'father': father_info,
        'father_job': applicant.representative2_job or '',

        'medical_agreement': 'Да' if applicant.medical_contract else 'Нет',  # оставить пустым
        'grade_russian': str(applicant.grade_russian) if applicant.grade_russian else '',
        'grade_biology': str(applicant.grade_biology) if applicant.grade_biology else '',
        'grade_chemistry': str(applicant.grade_chemistry) if applicant.grade_chemistry else '',
        'grade_math': str(applicant.grade_math) if applicant.grade_math else '',
        'grade_foreign': str(applicant.grade_language) if applicant.grade_language else '',
        'grade_physics': str(applicant.grade_physics) if applicant.grade_physics else '',
        # 'average_grade': average_grade,
        'average_grade': str(applicant.average_grade),
    }

    # Рендер
    doc.render(context)
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer
