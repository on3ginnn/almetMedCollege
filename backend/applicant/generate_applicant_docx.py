from docx import Document

from django.http import HttpResponse
from django.template.defaultfilters import date as _date
import io

from .models import Applicant

def generate_application_docx(applicant: Applicant):
    template_path = 'static/docs/applicant.docx'
    doc = Document(template_path)

    replacements = {
        '{{full_name}}': applicant.full_name,
        '{{birth_date}}': _date(applicant.birth_date, 'd.m.Y'),
        '{{birth_place}}': applicant.birth_place,
        '{{citizenship}}': applicant.citizenship,
        '{{passport_info}}': applicant.passport_info,
        '{{address}}': applicant.address,
        '{{snils}}': applicant.snils,
        '{{inn}}': applicant.inn,
        '{{student_phone}}': applicant.student_phone,
        '{{average_grade}}': str(applicant.average_grade),
        '{{grade_russian}}': str(applicant.grade_russian),
        '{{grade_biology}}': str(applicant.grade_biology),
        '{{grade_chemistry}}': str(applicant.grade_chemistry),
        '{{grade_math}}': str(applicant.grade_math),
        '{{grade_foreign}}': str(applicant.grade_foreign),
        '{{grade_physics}}': str(applicant.grade_physics),
        '{{mother_name}}': applicant.mother_name,
        '{{mother_job}}': applicant.mother_job,
        '{{mother_phone}}': applicant.mother_phone,
        '{{father_name}}': applicant.father_name,
        '{{father_job}}': applicant.father_job,
        '{{father_phone}}': applicant.father_phone,
        '{{admission_type}}': applicant.admission_type,
        '{{needs_dormitory}}': 'нуждаюсь' if applicant.needs_dormitory else 'не нуждаюсь',
    }

    for p in doc.paragraphs:
        for key, val in replacements.items():
            if key in p.text:
                p.text = p.text.replace(key, val)

    # Сохраняем в память
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)

    return buffer
