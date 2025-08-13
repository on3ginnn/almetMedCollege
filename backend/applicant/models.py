from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime


class Applicant(models.Model):
    SPECIALTY_CHOICES = [
        ('pharmacy', 'Фармация'),
        ('nursing', 'Сестринское дело'),
        ('nursing_zaochno', 'Сестринское дело очно-заочно'),
        ('midwifery', 'Акушерское дело'),
        ('lab_diagnostics', 'Лабораторная диагностика'),
        ('medical_treatment', 'Лечебное дело'),
        ('medical_treatment_11', 'Лечебное дело на базе 11 класса'),
    ]
    
    PRIORITY_ENROLLMENT_CHOICES = [
        ('heroes_rf', 'Герои Российской Федерации, лица, награжденные тремя орденами Мужества'),
        ('svo_participants', 'Участники боевых действий и служащие на территориях СВО и граничащих с ними, а также их дети'),
        ('covid_med_workers', 'Дети умерших от COVID-19 медработников'),
        ('none', 'Не отношусь ни к одной из категорий'),
    ]

    PREFERENTIAL_ENROLLMENT_CHOICES = [
        ('orphans', 'Дети-сироты и дети, оставшиеся без попечения родителей'),
        ('disabled', 'Дети-инвалиды, инвалиды 1-2 группы'),
        ('veterans', 'Ветераны и участники боевых действий'),
        ('low_income_disabled', 'Дети младше 20 лет из неполных малоимущих семей, если их родители — инвалиды I группы'),
        ('chernobyl', 'Люди, пострадавшие от аварии на Чернобыльской АЭС'),
        ('military_personnel', 'Военнослужащие и сотрудники силовых ведомств, а также их дети'),
        ('none', 'Не отношусь ни к одной из категорий'),
    ]

    STUDY_FORM_CHOICES = [
        ('очная', 'Очная форма обучения'),
        ('очно-заочная', 'Очно-заочная (вечерняя) форма обучения'),
    ]

    DOCUMENTS_TYPE_CHOICES = [
        ('оригинал', 'Оригинал'),
        ('копия', 'Копия'),
        ('none', 'Не выбранно'),
    ]
    
    ADMISSION_TYPE_CHOICES = [
        ("бюджет", "Финансируемые из средств бюджета Республики Татарстан"),
        ("коммерция", "На места с полным возмещением затрат"),
    ]

    registration_number = models.CharField("Регистрационный номер", max_length=20, blank=True, default="")
    full_name = models.CharField("ФИО", max_length=255)
    citizenship = models.CharField("Гражданство", max_length=100, blank=True)
    nationality = models.CharField("Национальность", max_length=100, blank=True)
    birth_date = models.DateField("Дата рождения")
    birth_place = models.CharField("Место рождения", max_length=255, blank=True)
    address = models.TextField("Адрес места жительства по паспорту", blank=True)
    address_actual = models.TextField("Фактический адрес места жительства")
    certificate_series = models.CharField("Номер аттестата", max_length=14, blank=True)
    certificate_issued_date = models.DateField("Дата выдачи аттестата", null=True, blank=True)

    graduation_year = models.PositiveIntegerField(
        "Год окончания учебного заведения",
        validators=[
            MinValueValidator(1980, "Год должен быть не ранее 1980"),
            MaxValueValidator(datetime.now().year, "Год не может быть в будущем")
        ],
        null=True,
        blank=True
    )
    graduation_institution = models.CharField("Наименование учебного заведения", max_length=255, blank=True)

    passport_series = models.CharField("Серия паспорта", max_length=4, blank=True)
    passport_number = models.CharField("Номер паспорта", max_length=6, blank=True)
    passport_issued_by = models.CharField("Кем выдан", max_length=255, blank=True)
    passport_issued_date = models.DateField("Дата выдачи", null=True, blank=True)
    passport_division_code = models.CharField("Код подразделения", max_length=6, blank=True)
    passport_registration_date = models.DateField("Дата регистрации прописки по паспорту", null=True, blank=True)

    inn = models.CharField("ИНН", max_length=12, blank=True)
    snils = models.CharField("СНИЛС", max_length=11)
    medical_policy = models.CharField("Медицинский полис", max_length=100, blank=True)
    military_id = models.BooleanField("Приписное свидетельство (для юношей)", default=False)
    medical_contract = models.BooleanField("Наличие договора или ходатайства с медицинской организацией", default=False)
    student_phone = models.CharField("Телефон абитуриента", max_length=20, blank=True)
    student_email = models.EmailField("Email абитуриента", max_length=254, blank=True)

    representative1_name = models.CharField("ФИО представителя 1 (мама/жена)", max_length=255, blank=True)
    representative1_phone = models.CharField("Телефон представителя 1", max_length=20, blank=True)
    representative1_job = models.CharField("Место работы и должность представителя 1", max_length=255, blank=True)
    representative1_passport_series = models.CharField("Серия паспорта представителя 1", max_length=4, blank=True)
    representative1_passport_number = models.CharField("Номер паспорта представителя 1", max_length=6, blank=True)
    representative1_passport_issued_by = models.CharField("Кем выдан паспорт представителя 1", max_length=255, blank=True)
    representative1_passport_issued_date = models.DateField("Дата выдачи паспорта представителя 1", null=True, blank=True)

    representative2_name = models.CharField("ФИО представителя 2 (папа/муж)", max_length=255, blank=True)
    representative2_phone = models.CharField("Телефон представителя 2", max_length=20, blank=True)
    representative2_job = models.CharField("Место работы и должность представителя 2", max_length=255, blank=True)
    representative2_passport_series = models.CharField("Серия паспорта представителя 2", max_length=4, blank=True)
    representative2_passport_number = models.CharField("Номер паспорта представителя 2", max_length=6, blank=True)
    representative2_passport_issued_by = models.CharField("Кем выдан паспорт представителя 2", max_length=255, blank=True)
    representative2_passport_issued_date = models.DateField("Дата выдачи паспорта представителя 2", null=True, blank=True)

    documents_delivered = models.BooleanField("Статус сдал документы", default=False)
    gosuslugi = models.BooleanField("Подал через госуслуги РФ", default=False, blank=True)
    documents_canceled = models.BooleanField("Забрал документы", default=False, blank=True)
    specialty = models.CharField("Специальность", max_length=50, choices=SPECIALTY_CHOICES)
    admission_type = models.CharField("Бюджет/коммерция", max_length=50, choices=ADMISSION_TYPE_CHOICES)
    needs_dormitory = models.BooleanField("Нуждается в общежитии", default=False)
    documents_submitted = models.CharField(
        "Тип поданных документов",
        max_length=10,
        choices=DOCUMENTS_TYPE_CHOICES,
        default='none',
    )
    study_form = models.CharField(
        "Форма обучения",
        max_length=20,
        choices=STUDY_FORM_CHOICES,
    )
    priority_enrollment = models.CharField(
        "Первоочередное зачисление",
        max_length=50,
        choices=PRIORITY_ENROLLMENT_CHOICES,
        default='none',
    )
    preferential_enrollment = models.CharField(
        "Преимущественное право на зачисление",
        max_length=50,
        choices=PREFERENTIAL_ENROLLMENT_CHOICES,
        default='none',
    )
    grade_russian = models.IntegerField(
        "Оценка по русскому языку",
        validators=[
            MinValueValidator(3, "Оценка должна быть не менее 3"),
            MaxValueValidator(5, "Оценка должна быть не более 5")
        ],
        blank=True,
        null=True,
    )
    grade_biology = models.IntegerField(
        "Оценка по биологии",
        validators=[
            MinValueValidator(3, "Оценка должна быть не менее 3"),
            MaxValueValidator(5, "Оценка должна быть не более 5")
        ],
        blank=True,
        null=True,
    )
    grade_chemistry = models.IntegerField(
        "Оценка по химии",
        validators=[
            MinValueValidator(3, "Оценка должна быть не менее 3"),
            MaxValueValidator(5, "Оценка должна быть не более 5")
        ],
        blank=True,
        null=True,
    )
    grade_math = models.IntegerField(
        "Оценка по математике",
        validators=[
            MinValueValidator(3, "Оценка должна быть не менее 3"),
            MaxValueValidator(5, "Оценка должна быть не более 5")
        ],
        blank=True,
        null=True,
    )
    grade_language = models.IntegerField(
        "Оценка по иностранному языку",
        validators=[
            MinValueValidator(3, "Оценка должна быть не менее 3"),
            MaxValueValidator(5, "Оценка должна быть не более 5")
        ],
        blank=True,
        null=True,
    )
    grade_physics = models.IntegerField(
        "Оценка по физике",
        validators=[
            MinValueValidator(3, "Оценка должна быть не менее 3"),
            MaxValueValidator(5, "Оценка должна быть не более 5")
        ],
        blank=True,
        null=True,
    )
    average_grade = models.FloatField(
        "Заявленный средний балл",
            validators=[
                MinValueValidator(3.00, message="Средний балл не может быть ниже 3.00"),
                MaxValueValidator(5.00, message="Средний балл не может быть выше 5.00"),
            ]
    )
    enrolled = models.BooleanField("Зачислен", default=False)
    submitted_at = models.DateTimeField("Дата подачи", auto_now_add=True)

    def __str__(self):
        return self.full_name or "Без имени"
    

class ApplicantSubject(models.Model):
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, related_name='subjects')
    subject_name = models.CharField("Название предмета", max_length=100)
    grade = models.IntegerField(
        "Оценка",
        validators=[
            MinValueValidator(3, "Оценка должна быть не менее 3"),
            MaxValueValidator(5, "Оценка должна быть не более 5")
        ]
    )

    class Meta:
        unique_together = ('applicant', 'subject_name')

    def __str__(self):
        return f"{self.applicant.full_name} - {self.subject_name}: {self.grade}"