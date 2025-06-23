from docxtpl import DocxTemplate
from django.http import HttpResponse
from django.template.defaultfilters import date as _date
import io
from datetime import datetime
from .models import Applicant
from io import BytesIO
from collections import defaultdict
from openpyxl import Workbook


def generate_applicants_excel():
    applicants = Applicant.objects.filter(documents_delivered=True).order_by('specialty')
    
    specialty_groups = defaultdict(list)
    for applicant in applicants:
        specialty_groups[applicant.specialty].append(applicant)
    
    wb = Workbook()
    wb.remove(wb.active)

    headers = [
        'Рег.номер', 'Специальность', 'Фамилия Имя Отчиство', 'Гражданство', 'Национальность',
        'Дата рождения', 'Место рождения', 'Адрес местожительства', 'Серия, № аттестата',
        'Год окончания, наименование учебного заведения',
        'Паспортные данные (серия, номер, кем и когда выдан)', 'ИНН',
        'Страховое свидетельство (СНИЛС)', 'Медицинский полис (организация:ЧМ, АБ и т.д.)',
        'Приписное свидетельство (да/нет)', '№ телефона студента', 'ФИО, № телефона мамы',
        'Место работы мамы, должность', 'ФИО, № телефона папы', 'Место работы папы, должность',
        'Русский язык', 'Биология', 'Химия', 'Математика', 'Иностранный язык', 'Физика',
        'Средний балл аттестата', 'Бюджет/коммерция',
        'Нуждается в общежитии', 'Тип поданных документов', 'Форма обучения',
        'Первоочередное зачисление', 'Преимущественное право на зачисление'
    ]

    specialty_map = dict(Applicant.SPECIALTY_CHOICES)

    priority_enrollment_map = dict(Applicant.PRIORITY_ENROLLMENT_CHOICES)
    preferential_enrollment_map = dict(Applicant.PREFERENTIAL_ENROLLMENT_CHOICES)

    for specialty_code, applicants in specialty_groups.items():
        specialty_name = specialty_map.get(specialty_code, specialty_code)
        sheet_name = specialty_name[:31].replace('/', '_').replace('\\', '_').replace('?', '').replace('*', '').replace('[', '').replace(']', '')
        
        ws = wb.create_sheet(title=sheet_name)
        ws.append(headers)

        for applicant in applicants:
            graduation_info = (
                f"{applicant.graduation_year}, {applicant.graduation_institution}"
                if applicant.graduation_year and applicant.graduation_institution else ''
            )
            passport_data = (
                f"{applicant.passport_series} {applicant.passport_number}, "
                f"{applicant.passport_issued_by}, {_date(applicant.passport_issued_date, 'd.m.Y')}"
                if all([applicant.passport_series, applicant.passport_number, applicant.passport_issued_by, applicant.passport_issued_date])
                else ''
            )
            mother_info = (
                f"{applicant.mother_name}, {applicant.mother_phone}"
                if applicant.mother_name and applicant.mother_phone else ''
            )
            father_info = (
                f"{applicant.father_name}, {applicant.father_phone}"
                if applicant.father_name and applicant.father_phone else ''
            )

            ws.append([
                '',
                specialty_name,
                applicant.full_name,
                applicant.citizenship,
                applicant.nationality,
                _date(applicant.birth_date, 'd.m.Y') if applicant.birth_date else '',
                applicant.birth_place,
                applicant.address,
                applicant.certificate_series,
                graduation_info,
                passport_data,
                applicant.inn,
                applicant.snils,
                applicant.medical_policy,
                'Да' if applicant.military_id else 'Нет',
                applicant.student_phone,
                mother_info,
                applicant.mother_job,
                father_info,
                applicant.father_job,
                applicant.grade_russian,
                applicant.grade_biology,
                applicant.grade_chemistry,
                applicant.grade_math,
                applicant.grade_language,
                applicant.grade_physics,
                applicant.average_grade,
                applicant.admission_type,
                'Да' if applicant.needs_dormitory else 'Нет',
                applicant.documents_submitted,
                dict(Applicant.STUDY_FORM_CHOICES).get(applicant.study_form, ''),
                priority_enrollment_map.get(applicant.priority_enrollment, ''),
                preferential_enrollment_map.get(applicant.preferential_enrollment, '')
            ])

    if not specialty_groups:
        ws = wb.create_sheet(title="No Applicants")
        ws.append(headers)
        ws.append(['Нет абитуриентов с сданными документами'])

    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer


def generate_application_docx(applicant: Applicant):
    template_path = 'static/docx/applicant.docx'
    doc = DocxTemplate(template_path)

    # Split full_name into parts
    name_parts = applicant.full_name.split()
    last_name = name_parts[0] if len(name_parts) > 0 else ''
    first_name = name_parts[1] if len(name_parts) > 1 else ''
    father_name = name_parts[2] if len(name_parts) > 2 else ''

    # Map specialty to human-readable form and determine base
    specialty_map = {
        'pharmacy': 'Фармация',
        'nursing': 'Сестринское дело',
        'midwifery': 'Акушерское дело',
        'lab_diagnostics': 'Лабораторная диагностика',
        'medical_treatment': 'Лечебное дело',
    }
    specialty = specialty_map.get(applicant.specialty, '')

    # Clean SNILS
    clean_snils = applicant.snils.replace('-', '').replace(' ', '') if applicant.snils else ''

    # Format parent passport details
    mother_passport = (
        f'Серия: {applicant.mother_passport_series} № {applicant.mother_passport_number}, '
        f'выдан: {applicant.mother_passport_issued_by}, {_date(applicant.mother_passport_issued_date, "d.m.Y")}'
        if all([applicant.mother_passport_series, applicant.mother_passport_number, applicant.mother_passport_issued_by, applicant.mother_passport_issued_date])
        else ''
    )
    father_passport = (
        f'Серия: {applicant.father_passport_series} № {applicant.father_passport_number}, '
        f'выдан: {applicant.father_passport_issued_by}, {_date(applicant.father_passport_issued_date, "d.m.Y")}'
        if all([applicant.father_passport_series, applicant.father_passport_number, applicant.father_passport_issued_by, applicant.father_passport_issued_date])
        else ''
    )

    # Determine social benefits
    benefits_enrollment =  'Нет' if applicant.priority_enrollment == 'none' and applicant.preferential_enrollment == 'none' else 'Да'
    # Context for template rendering
    context = {
        'registration_number': '',
        'last_name': last_name,
        'first_name': first_name,
        'father_name': father_name,
        'birth_date': _date(applicant.birth_date, 'd.m.Y') if applicant.birth_date else '',
        'birth_place': applicant.birth_place or '',
        'citizenship': applicant.citizenship or '',
        'passport_series': applicant.passport_series or '',
        'passport_number': applicant.passport_number or '',
        'passport_issued_date': _date(applicant.passport_issued_date, 'd.m.Y') if applicant.passport_issued_date else '',
        'passport_issued_by': applicant.passport_issued_by or '',
        'passport_division_code': applicant.passport_division_code or '',
        'address': applicant.address or '',
        'address_actual': applicant.address_actual or applicant.address or 'тот же',
        'passport_registration_date': _date(applicant.passport_registration_date, 'd.m.Y') if applicant.passport_registration_date else '',
        'snils': clean_snils,
        'inn': applicant.inn or '',
        'medical_policy': applicant.medical_policy or '',
        'military_id': 'Да' if applicant.military_id else 'Нет',
        'student_phone': applicant.student_phone or '',
        'email': applicant.student_email or '',
        'specialty': specialty,
        'study_form_verbose': dict(Applicant.STUDY_FORM_CHOICES).get(applicant.study_form, ''),
        'documents_submitted': applicant.documents_submitted or '',
        'admission_type': dict(Applicant.ADMISSION_TYPE_CHOICES).get(applicant.admission_type, ''),
        'graduation_year': str(applicant.graduation_year) if applicant.graduation_year else '',
        'education_type': 'общеобразовательное учреждение (школа)',
        'graduation_institution': applicant.graduation_institution or '',
        'certificate_series': applicant.certificate_series or '',
        'certificate_issued_date': _date(applicant.certificate_issued_date, 'd.m.Y') if applicant.certificate_issued_date else '',
        'average_grade': str(applicant.average_grade) if applicant.average_grade else '',
        'grade_russian': str(applicant.grade_russian) if applicant.grade_russian else '',
        'grade_biology': str(applicant.grade_biology) if applicant.grade_biology else '',
        'grade_chemistry': str(applicant.grade_chemistry) if applicant.grade_chemistry else '',
        'grade_math': str(applicant.grade_math) if applicant.grade_math else '',
        'grade_language': str(applicant.grade_language) if applicant.grade_language else '',
        'grade_physics': str(applicant.grade_physics) if applicant.grade_physics else '',
        'benefits_enrollment': benefits_enrollment,
        'needs_dormitory': 'нуждаюсь' if applicant.needs_dormitory else 'не нуждаюсь',
        'mother_fio': applicant.mother_name or '',
        'mother_job': applicant.mother_job or '',
        'mother_phone': applicant.mother_phone or '',
        'mother_passport': mother_passport,
        'father_fio': applicant.father_name or '',
        'father_job': applicant.father_job or '',
        'father_phone': applicant.father_phone or '',
        'father_passport': father_passport,
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