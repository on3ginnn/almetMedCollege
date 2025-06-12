from docxtpl import DocxTemplate
from django.http import HttpResponse
from django.template.defaultfilters import date as _date
import io
from datetime import datetime
from .models import Applicant
import openpyxl
from io import BytesIO
from collections import defaultdict


def generate_applicants_excel():
    # Filter applicants with documents_delivered=True
    applicants = Applicant.objects.filter(documents_delivered=True).order_by('specialty')
    
    # Group applicants by specialty
    specialty_groups = defaultdict(list)
    for applicant in applicants:
        specialty_groups[applicant.specialty].append(applicant)
    
    # Create a new workbook
    wb = openpyxl.Workbook()
    # Remove the default sheet
    wb.remove(wb.active)

    # Define headers
    headers = [
        'Рег.номер', 'Специальность', 'Фамилия Имя Отчиство', 'Гражданство', 'Национальность',
        'Дата рождения', 'Место рождения', 'Адрес местожительства', 'Серия, № аттестата',
        'Дата окончания, наименование учебного заведения',
        'Паспортные данные (серия, номер, кем и когда выдан)', 'ИНН',
        'Страховое свидетельство (СНИЛС)', 'Медицинский полис (организация:ЧМ, АБ и т.д.)',
        'Приписное свидетельство (да/нет)', '№ телефона студента', 'ФИО, № телефона мамы',
        'Место работы мамы, должность', 'ФИО, № телефона папы', 'Место работы папы, должность',
        'Наличие договора или ходатайства с медицинской организацией (наименование мед. орг.) да/нет',
        'Русский язык', 'Биология', 'Химия', 'Математика', 'Иностранный язык', 'Физика',
        'Средний балл аттестата', 'Оригинал/копия', 'Бюджет/коммерция',
        'Подача заявления через госуслуги РФ да/нет', 'Нуждается в общежитии',
        'Лица указанные в 7 статьи 71 Федерального закона "Об образовании в Российской Федерации", предоставляется преимущественное право зачисления',
        'Лицам, указанным в части 5 статьи 71 Федерального закона, предоставляется право на зачисление на обучение по образовательным программам СПО в первоочередном порядке вне зависимости от результатов',
        'СНИЛС', 'Средний балл аттестата', 'Оригинал/копия', 'Бюджет/коммерция',
        'Преимущественное право', 'Первоочередное право'
    ]

    # Map specialties to human-readable names
    specialty_map = dict(Applicant.SPECIALTY_CHOICES)

    # Create a sheet for each specialty
    for specialty_code, applicants in specialty_groups.items():
        # Get human-readable specialty name
        specialty_name = specialty_map.get(specialty_code, specialty_code)
        # Sanitize sheet name (max 31 chars, no invalid chars)
        sheet_name = specialty_name[:31].replace('/', '_').replace('\\', '_').replace('?', '').replace('*', '').replace('[', '').replace(']', '')
        
        # Create new sheet
        ws = wb.create_sheet(title=sheet_name)
        
        # Append headers
        ws.append(headers)

        # Add data rows
        for applicant in applicants:
            # Format combined fields
            graduation_info = (
                f"{_date(applicant.graduation_date, 'd.m.Y')}, {applicant.graduation_institution}"
                if applicant.graduation_date and applicant.graduation_institution else ''
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
                applicant.id,  # Рег.номер
                specialty_name,  # Специальность
                applicant.full_name,  # Фамилия Имя Отчиство
                applicant.citizenship,  # Гражданство
                applicant.nationality,  # Национальность
                applicant.birth_date,  # Дата рождения
                applicant.birth_place,  # Место рождения
                applicant.address,  # Адрес местожительства
                applicant.certificate_series,  # Серия, № аттестата
                graduation_info,  # Дата окончания, наименование учебного заведения
                passport_data,  # Паспортные данные
                applicant.inn,  # ИНН
                applicant.snils,  # СНИЛС
                applicant.medical_policy,  # Медицинский полис
                'Да' if applicant.military_id else 'Нет',  # Приписное свидетельство
                applicant.student_phone,  # № телефона студента
                mother_info,  # ФИО, № телефона мамы
                applicant.mother_job,  # Место работы мамы, должность
                father_info,  # ФИО, № телефона папы
                applicant.father_job,  # Место работы папы, должность
                '',  # Наличие договора или ходатайства (empty)
                applicant.grade_russian,  # Русский язык
                applicant.grade_biology,  # Биология
                applicant.grade_chemistry,  # Химия
                applicant.grade_math,  # Математика
                applicant.grade_language,  # Иностранный язык
                applicant.grade_physics,  # Физика
                applicant.average_grade,  # Средний балл аттестата
                '',  # Оригинал/копия (empty)
                applicant.admission_type,  # Бюджет/коммерция
                '',  # Подача через госуслуги (empty)
                'Да' if applicant.needs_dormitory else 'Нет',  # Нуждается в общежитии
                '',  # Лица по статье 7 (empty)
                '',  # Лица по части 5 статьи 71 (empty)
                applicant.snils,  # СНИЛС (duplicate)
                applicant.average_grade,  # Средний балл аттестата (duplicate)
                '',  # Оригинал/копия (duplicate, empty)
                applicant.admission_type,  # Бюджет/коммерция (duplicate)
                '',  # Преимущественное право (empty)
                ''   # Первоочередное право (empty)
            ])

    # If no applicants, create a default sheet with headers
    if not specialty_groups:
        ws = wb.create_sheet(title="No Applicants")
        ws.append(headers)
        ws.append(['Нет абитуриентов с сданными документами'])

    # Save to a BytesIO buffer for Django response
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer


def generate_application_docx(applicant: Applicant):
    template_path = 'static/docx/applicant.docx'
    doc = DocxTemplate(template_path)

    # Split full_name into parts
    name_parts = applicant.full_name.split()
    print(name_parts)
    last_name = name_parts[0] if len(name_parts) > 0 else ''
    first_name = name_parts[1] if len(name_parts) > 1 else ''
    father_name = name_parts[2] if len(name_parts) > 2 else ''

    # Map specialty to human-readable form
    specialty_map = {
        'pharmacy': 'Фармация',
        'nursing': 'Сестринское дело',
        'midwifery': 'Акушерское дело',
        'lab_diagnostics': 'Лабораторная диагностика',
        'medical_treatment': 'Лечебное дело',
    }
    specialty = specialty_map.get(applicant.specialty, '')

    # Determine specialty section
    specialty_base = specialty if applicant.specialty != 'medical_treatment' else ''
    specialty_advance = specialty if applicant.specialty == 'medical_treatment' else ''
    specialty_part_time = 'Сестринское дело' if applicant.specialty == 'nursing' else ''

    # Clean SNILS
    clean_snils = applicant.snils.replace('-', '').replace(' ', '')

    # Format parent passport details
    mother_passport = (
        f'Серия: {applicant.mother_passport_series} № {applicant.mother_passport_number}, '
        f'выдан: {applicant.mother_passport_issued_by}, {_date(applicant.mother_passport_issued_date, "d.m.Y")}'
    )
    father_passport = (
        f'Серия: {applicant.father_passport_series} № {applicant.father_passport_number}, '
        f'выдан: {applicant.father_passport_issued_by}, {_date(applicant.father_passport_issued_date, "d.m.Y")}'
    )

    # Context for template rendering
    context = {
        'registration_number': '',
        'last_name': last_name,
        'first_name': first_name,
        'father_name': father_name,
        'birth_date': _date(applicant.birth_date, 'd.m.Y') if applicant.birth_date else '',
        'birth_place': applicant.birth_place or '',
        'citizenship': applicant.citizenship or '',
        # 'nationality': applicant.nationality or '',
        'passport_series': applicant.passport_series or '',
        'passport_number': applicant.passport_number or '',
        'passport_issued_date': _date(applicant.passport_issued_date, 'd.m.Y') if applicant.passport_issued_date else '',
        'passport_issued_by': applicant.passport_issued_by or '',
        'address': applicant.address or '',
        'address_actual': applicant.address or '',  # Assume same as registered
        'snils': clean_snils or '',
        'inn': applicant.inn or '',
        'medical_policy': applicant.medical_policy or '',
        'military_id': 'Да' if applicant.military_id else 'Нет',
        'student_phone': applicant.student_phone or '',
        'email': '',
        'specialty': specialty,
        'specialty_base': specialty_base,
        'specialty_advance': specialty_advance,
        'specialty_part_time': specialty_part_time,
        'admission_type': applicant.admission_type or '',
        'graduation_year': str(applicant.graduation_year) if applicant.graduation_year else '',
        'education_type': 'общеобразовательное учреждение (школа)',
        'graduation_institution': applicant.graduation_institution or '',
        'certificate_series': applicant.certificate_series or '',
        'certificate_number': '',
        'certificate_issued_date': _date(applicant.graduation_date, 'd.m.Y') if applicant.graduation_date else '',
        'average_grade': str(applicant.average_grade) if applicant.average_grade else '',
        'grade_russian': str(applicant.grade_russian) if applicant.grade_russian else '',
        'grade_biology': str(applicant.grade_biology) if applicant.grade_biology else '',
        'grade_chemistry': str(applicant.grade_chemistry) if applicant.grade_chemistry else '',
        'grade_math': str(applicant.grade_math) if applicant.grade_math else '',
        'grade_language': str(applicant.grade_language) if applicant.grade_language else '',
        'grade_physics': str(applicant.grade_physics) if applicant.grade_physics else '',
        'social_benefits': '',
        'needs_dormitory': 'нуждаюсь' if applicant.needs_dormitory else 'не нуждаюсь',
        'mother_fio': applicant.mother_name or '',
        'mother_job': applicant.mother_job or '',
        'mother_phone': applicant.mother_phone or '',
        'mother_passport': mother_passport,
        'mother_passport_series': applicant.mother_passport_series or '',
        'mother_passport_number': applicant.mother_passport_number or '',
        'mother_passport_issued_by': applicant.mother_passport_issued_by or '',
        'mother_passport_issued_date': _date(applicant.mother_passport_issued_date, 'd.m.Y') if applicant.mother_passport_issued_date else '',
        'father_fio': applicant.father_name or '',
        'father_job': applicant.father_job or '',
        'father_phone': applicant.father_phone or '',
        'father_passport': father_passport,
        'father_passport_series': applicant.father_passport_series or '',
        'father_passport_number': applicant.father_passport_number or '',
        'father_passport_issued_by': applicant.father_passport_issued_by or '',
        'father_passport_issued_date': _date(applicant.father_passport_issued_date, 'd.m.Y') if applicant.father_passport_issued_date else '',
        'consent_personal_data': 'Согласен',
        'consent_passport_copy': 'Согласен',
        'consent_media': 'Согласен',
        'consent_russian_language': 'Согласен',
        'consent_exams': 'Согласен',
        'consent_license': 'Ознакомлен',
        'consent_document_deadline': 'Ознакомлен',
        'consent_rules': 'Ознакомлен',
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