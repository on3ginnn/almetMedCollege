from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Applicant(models.Model):
    SPECIALTY_CHOICES = [
        ('pharmacy', 'Фармация'),
        ('nursing', 'Сестринское дело'),
        ('midwifery', 'Акушерское дело'),
        ('lab_diagnostics', 'Лабораторная диагностика'),
        ('medical_treatment', 'Лечебное дело'),
    ]

    full_name = models.CharField("ФИО", max_length=255)
    citizenship = models.CharField("Гражданство", max_length=100)
    nationality = models.CharField("Национальность", max_length=100)
    birth_date = models.DateField("Дата рождения")
    birth_place = models.CharField("Место рождения", max_length=255)
    address = models.TextField("Адрес места жительства по паспорту")
    address_actual = models.TextField("Фактический адрес места жительства")
    passport_division_code = models.CharField("Код подразделения", max_length=6)
    passport_registration_date = models.DateField("Дата регистрации прописки по паспорту")
    certificate_series = models.CharField("Номер аттестата", max_length=14)
    certificate_issued_date = models.DateField("Дата выдачи аттестата")

    graduation_date = models.DateField("Дата окончания учебного заведения")
    graduation_institution = models.CharField("Наименование учебного заведения", max_length=255)

    passport_series = models.CharField("Серия паспорта", max_length=4)
    passport_number = models.CharField("Номер паспорта", max_length=6)
    passport_issued_by = models.CharField("Кем выдан", max_length=255)
    passport_issued_date = models.DateField("Дата выдачи")

    inn = models.CharField("ИНН", max_length=12)
    snils = models.CharField("СНИЛС", max_length=11)
    medical_policy = models.CharField("Медицинский полис", max_length=100)
    military_id = models.BooleanField("Приписное свидетельство (да/нет)")
    student_phone = models.CharField("Телефон абитуриента", max_length=20)
    student_email = models.EmailField("Email абитуриента", max_length=254)

    mother_name = models.CharField("ФИО мамы", max_length=255)
    mother_phone = models.CharField("Телефон мамы", max_length=20)
    mother_job = models.CharField("Место работы и должность мамы", max_length=255)
    mother_passport_series = models.CharField("Серия паспорта", max_length=4)
    mother_passport_number = models.CharField("Номер паспорта", max_length=6)
    mother_passport_issued_by = models.CharField("Кем выдан", max_length=255)
    mother_passport_issued_date = models.DateField("Дата выдачи")

    father_name = models.CharField("ФИО папы", max_length=255)
    father_phone = models.CharField("Телефон папы", max_length=20)
    father_job = models.CharField("Место работы и должность папы", max_length=255)
    father_passport_series = models.CharField("Серия паспорта", max_length=4)
    father_passport_number = models.CharField("Номер паспорта", max_length=6)
    father_passport_issued_by = models.CharField("Кем выдан", max_length=255)
    father_passport_issued_date = models.DateField("Дата выдачи")

    documents_delivered = models.BooleanField("Статус сдал документы", default=False)

    specialty = models.CharField("Специальность", max_length=50, choices=SPECIALTY_CHOICES)

    grade_russian = models.IntegerField(
        "Русский язык",
        validators=[MinValueValidator(3, "Оценка должна быть не менее 3"), MaxValueValidator(5, "Оценка должна быть не более 5")]
    )
    grade_biology = models.IntegerField(
        "Биология",
        validators=[MinValueValidator(3, "Оценка должна быть не менее 3"), MaxValueValidator(5, "Оценка должна быть не более 5")]
    )
    grade_chemistry = models.IntegerField(
        "Химия",
        validators=[MinValueValidator(3, "Оценка должна быть не менее 3"), MaxValueValidator(5, "Оценка должна быть не более 5")]
    )
    grade_math = models.IntegerField(
        "Математика",
        validators=[MinValueValidator(3, "Оценка должна быть не менее 3"), MaxValueValidator(5, "Оценка должна быть не более 5")]
    )
    grade_language = models.IntegerField(
        "Иностранный язык",
        validators=[MinValueValidator(3, "Оценка должна быть не менее 3"), MaxValueValidator(5, "Оценка должна быть не более 5")]
    )
    grade_physics = models.IntegerField(
        "Физика",
        validators=[MinValueValidator(3, "Оценка должна быть не менее 3"), MaxValueValidator(5, "Оценка должна быть не более 5")]
    )
    average_grade = models.FloatField("Средний балл")

    # documents_submitted = models.CharField("Подали документы", max_length=50, choices=[("оригинал", "Оригинал"), ("копия", "Копия")])
    admission_type = models.CharField("Бюджет/коммерция", max_length=50, choices=[("бюджет", "Бюджет"), ("коммерция", "Коммерция")])
    # via_gosuslugi = models.BooleanField("Подача заявления через Госуслуги")
    needs_dormitory = models.BooleanField("Нуждается в общежитии")

    enrolled = models.BooleanField("Зачислен", default=False)
    submitted_at = models.DateTimeField("Дата подачи", auto_now_add=True)

    def __str__(self):
        return self.full_name