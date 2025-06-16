import * as yup from 'yup';


// Validation schema
export const schema = yup.object().shape({
  full_name: yup.string().required('ФИО обязательно').max(255),
  citizenship: yup.string().required('Гражданство обязательно').max(100),
  nationality: yup.string().required('Национальность обязательно').max(100),
  birth_date: yup
    .date()
    .required('Дата рождения обязательна')
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем'),
  birth_place: yup.string().max(255),
  address: yup.string().required('Адрес по паспорту обязателен').max(255, 'Максимум 255 символов'),
  address_actual: yup.string().required('Фактический адрес обязателен').max(255, 'Максимум 255 символов'),
  passport_division_code: yup
    .string()
    .matches(/^\d{3}-\d{3}$/, 'Код подразделения должен быть 6 цифр')
    .required('Код подразделения обязателен'),
  passport_registration_date: yup
    .date()
    .required('Дата регистрации обязательна')
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем'),
  certificate_series: yup
    .string()
    .required('Серия аттестата обязательна')
    .max(14),
  certificate_issued_date: yup
    .date()
    .required('Дата выдачи аттестата обязательна')
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем'),
  graduation_year: yup
    .number()
    .required('Год окончания обязателен')
    .min(1900, 'Год не ранее 1900')
    .max(new Date().getFullYear(), 'Год не может быть в будущем')
    .typeError('Введите число'),
  graduation_institution: yup
    .string()
    .required('Учебное заведение обязательно')
    .max(255),
  passport_series: yup
    .string()
    .matches(/^\d{4}$/, 'Серия паспорта — 4 цифры')
    .required('Серия паспорта обязательна'),
  passport_number: yup
    .string()
    .matches(/^\d{6}$/, 'Номер паспорта — 6 цифр')
    .required('Номер паспорта обязателен'),
  passport_issued_by: yup.string().required('Кем выдан паспорт обязателен').max(255),
  passport_issued_date: yup
    .date()
    .required('Дата выдачи паспорта обязательна')
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем'),
  inn: yup
    .string()
    .matches(/^\d{12}$/, 'ИНН — 12 цифр')
    .required('ИНН обязателен'),
  snils: yup
    .string()
    .matches(/^\d{3}-\d{3}-\d{3}-\d{2}$/, 'СНИЛС формата XXX-XXX-XXX-XX')
    .required('СНИЛС обязателен'),
    // .transform((value) => value.replace(/-/g, '')),
  medical_policy: yup.string().required('Мед. полис обязателен').max(100),
  military_id: yup.boolean(),
  student_phone: yup
    .string()
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{4}$/, 'Телефон формата +7 (XXX) XXX-XXXX')
    .required('Телефон обязателен'),
  student_email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен'),
  mother_name: yup.string().required('ФИО матери обязательно').max(255),
  mother_phone: yup
    .string()
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{4}$/, 'Телефон формата +7 (XXX) XXX-XXXX')
    .required('Телефон матери обязателен'),
  mother_job: yup.string().required('Место работы матери обязательно').max(255),
  mother_passport_series: yup
    .string()
    .matches(/^\d{4}$/, 'Серия паспорта — 4 цифры')
    .required('Серия паспорта матери обязательна'),
  mother_passport_number: yup
    .string()
    .matches(/^\d{6}$/, 'Номер паспорта — 6 цифр')
    .required('Номер паспорта матери обязателен'),
  mother_passport_issued_by: yup
    .string()
    .required('Кем выдан паспорт матери обязателен')
    .max(255),
  mother_passport_issued_date: yup
    .date()
    .required('Дата выдачи паспорта матери обязательна')
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем'),
  father_name: yup.string().required('ФИО отца обязательно').max(255),
  father_phone: yup
    .string()
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{4}$/, 'Телефон формата +7 (XXX) XXX-XXXX')
    .required('Телефон отца обязателен'),
  father_job: yup.string().required('Место работы отца обязательно').max(255),
  father_passport_series: yup
    .string()
    .matches(/^\d{4}$/, 'Серия паспорта — 4 цифры')
    .required('Серия паспорта отца обязательна'),
  father_passport_number: yup
    .string()
    .matches(/^\d{6}$/, 'Номер паспорта — 6 цифр')
    .required('Номер паспорта отца обязателен'),
  father_passport_issued_by: yup
    .string()
    .required('Кем выдан паспорт отца обязателен')
    .max(255),
  father_passport_issued_date: yup
    .date()
    .required('Дата выдачи паспорта отца обязательна')
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем'),
  documents_delivered: yup.boolean(),
  specialty: yup
    .string()
    .required('Специальность обязательна')
    .oneOf(
      [
        'pharmacy_9',
        'nursing_9',
        'nursing_11_part_time',
        'midwifery_9',
        'lab_diagnostics_9',
        'medical_treatment_9',
        'medical_treatment_11',
      ],
      'Выберите корректную специальность'
    ),
  grade_russian: yup
    .number()
    .required('Оценка по русскому обязательна')
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .typeError('Выберите оценку'),
  grade_biology: yup
    .number()
    .required('Оценка по биологии обязательна')
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .typeError('Выберите оценку'),
  grade_chemistry: yup
    .number()
    .required('Оценка по химии обязательна')
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .typeError('Выберите оценку'),
  grade_math: yup
    .number()
    .required('Оценка по математике обязательна')
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .typeError('Выберите оценку'),
  grade_language: yup
    .number()
    .required('Оценка по языку обязательна')
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .typeError('Выберите оценку'),
  grade_physics: yup
    .number()
    .required('Оценка по физике обязательна')
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .typeError('Выберите оценку'),
  average_grade: yup
    .number()
    .required('Средний балл обязателен')
    .min(3.0, 'Средний балл от 3.0')
    .max(5.0, 'Средний балл до 5.0')
    .typeError('Введите средний бал в формате 4,8'),
  admission_type: yup
    .string()
    .required('Тип поступления обязателен')
    .oneOf(['бюджет', 'коммерция']),
  needs_dormitory: yup.boolean(),
  priority_enrollment: yup
    .string()
    .required('Категория обязательна')
    .oneOf(['heroes_rf', 'svo_participants', 'covid_med_workers', 'none']),
  preferential_enrollment: yup
    .string()
    .required('Категория обязательна')
    .oneOf([
      'orphans',
      'disabled',
      'veterans',
      'low_income_disabled',
      'chernobyl',
      'military_personnel',
      'none',
    ]),
});
