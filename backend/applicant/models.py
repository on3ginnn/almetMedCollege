from django.db import models

class Applicant(models.Model):
    full_name = models.CharField("ФИО", max_length=255)
    citizenship = models.CharField("Гражданство", max_length=100)
    nationality = models.CharField("Национальность", max_length=100)
    birth_date = models.DateField("Дата рождения")
    birth_place = models.CharField("Место рождения", max_length=255)
    address = models.TextField("Адрес места жительства")
    certificate_series = models.CharField("Серия, № аттестата", max_length=50)
    graduation_info = models.CharField("Дата окончания и наименование учебного заведения", max_length=255)
    passport_info = models.CharField("Паспортные данные", max_length=255)
    inn = models.CharField("ИНН", max_length=20)
    snils = models.CharField("СНИЛС", max_length=20)
    medical_policy = models.CharField("Медицинский полис (организация)", max_length=100)
    military_id = models.BooleanField("Приписное свидетельство (да/нет)")
    student_phone = models.CharField("Телефон студента", max_length=20)
    mother_name = models.CharField("ФИО мамы", max_length=255)
    mother_phone = models.CharField("Телефон мамы", max_length=20)
    mother_job = models.CharField("Место работы и должность мамы", max_length=255)
    father_name = models.CharField("ФИО папы", max_length=255)
    father_phone = models.CharField("Телефон папы", max_length=20)
    father_job = models.CharField("Место работы и должность папы", max_length=255)
    has_medical_contract = models.BooleanField("Наличие договора с мед. организацией")
    medical_org_name = models.CharField("Наименование мед. организации", max_length=255, blank=True)
    
    grade_russian = models.FloatField("Русский язык")
    grade_biology = models.FloatField("Биология")
    grade_chemistry = models.FloatField("Химия")
    grade_math = models.FloatField("Математика")
    grade_foreign = models.FloatField("Иностранный язык")
    grade_physics = models.FloatField("Физика")
    average_grade = models.FloatField("Средний балл")

    documents_submitted = models.CharField("Подали документы", max_length=50, choices=[("оригинал", "Оригинал"), ("копия", "Копия")])
    admission_type = models.CharField("Бюджет/коммерция", max_length=50, choices=[("бюджет", "Бюджет"), ("коммерция", "Коммерция")])
    via_gosuslugi = models.BooleanField("Подача заявления через Госуслуги")
    needs_dormitory = models.BooleanField("Нуждается в общежитии")

    enrolled = models.BooleanField("Зачислен", default=False)
    submitted_at = models.DateTimeField("Дата подачи", auto_now_add=True)

    def __str__(self):
        return self.full_name
