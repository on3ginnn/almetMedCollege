from docxtpl import DocxTemplate
from django.http import HttpResponse
from django.template.defaultfilters import date as _date
import io
from datetime import datetime
from .models import Applicant

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
        'graduation_year': str(applicant.graduation_date.year) if applicant.graduation_date else '',
        'education_type': 'общеобразовательное учреждение (школа)',
        'graduation_institution': applicant.graduation_institution or '',
        'certificate_series': applicant.certificate_series or '',
        'certificate_number': '',
        'graduation_date': _date(applicant.graduation_date, 'd.m.Y') if applicant.graduation_date else '',
        'average_grade': str(applicant.average_grade) if applicant.average_grade else '',
        'grade_russian': str(applicant.grade_russian) if applicant.grade_russian else '',
        'grade_biology': str(applicant.grade_biology) if applicant.grade_biology else '',
        'grade_chemistry': str(applicant.grade_chemistry) if applicant.grade_chemistry else '',
        'grade_math': str(applicant.grade_math) if applicant.grade_math else '',
        'grade_foreign': str(applicant.grade_foreign) if applicant.grade_foreign else '',
        'grade_physics': str(applicant.grade_physics) if applicant.grade_physics else '',
        'social_benefits': '',
        'needs_dormitory': 'нуждаюсь' if applicant.needs_dormitory else 'не нуждаюсь',
        'has_medical_contract': 'Да' if applicant.has_medical_contract else 'Нет',
        'via_gosuslugi': 'Да' if applicant.via_gosuslugi else 'Нет',
        'documents_submitted': applicant.documents_submitted or '',
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