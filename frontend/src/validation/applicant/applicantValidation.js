import * as yup from 'yup';

export const schema = yup.object().shape({
  registration_number: yup
    .string()
    .max(10, 'Максимум 10 символов')
    .nullable(),
  full_name: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .required('ФИО обязательно'),
  citizenship: yup
    .string()
    .max(100, 'Максимум 100 символов')
    .nullable(),
  nationality: yup
    .string()
    .max(100, 'Максимум 100 символов')
    .nullable(),
  birth_date: yup
    .date()
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем')
    .required('Дата рождения обязательна'),
    birth_place: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  address: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  address_actual: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .required("Фактический адресс обязателен"),
  passport_division_code: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-passport-division-code', 'Код подразделения должен быть формата XXX-XXX', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{3}-\d{3}$/.test(value);
    }),
  passport_registration_date: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем')
    .nullable(),
  certificate_series: yup
    .string()
    .max(14, 'Максимум 14 символов')
    .nullable(),
  certificate_issued_date: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем')
    .nullable(),
  graduation_year: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .nullable()
    .min(1980, 'Год не ранее 1980')
    .max(2025, 'Год не может быть в будущем')
    .typeError('Введите число'),
  graduation_institution: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  passport_series: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-passport-series', 'Серия паспорта — 4 цифры', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{4}$/.test(value);
    }),
  passport_number: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-passport-number', 'Номер паспорта — 6 цифр', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{6}$/.test(value);
    }),
  passport_issued_by: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  passport_issued_date: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем')
    .nullable(),
  inn: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-inn', 'ИНН — 12 цифр', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{12}$/.test(value);
    }),
  snils: yup
    .string()
    .matches(/^\d{3}-\d{3}-\d{3}-\d{2}$/, 'СНИЛС формата XXX-XXX-XXX-XX')
    .required('СНИЛС обязателен'),
  medical_policy: yup
    .string()
    .max(100, 'Максимум 100 символов')
    .nullable(),
  military_id: yup
    .boolean()
    .nullable(),
  medical_contract: yup
    .boolean()
    .nullable(),
  student_phone: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-phone', 'Телефон формата +7 (XXX) XXX-XXXX', function (value) {
      if (!value) return true; // Allow empty string
      return /^\+7 \(\d{3}\) \d{3}-\d{4}$/.test(value);
    }),
  student_email: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-email', 'Введите корректный email', function (value) {
      if (!value) return true; // Allow empty string
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Basic email regex
    }),
  representative1_name: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  representative1_phone: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-phone', 'Телефон формата +7 (XXX) XXX-XXXX', function (value) {
      if (!value) return true; // Allow empty string
      return /^\+7 \(\d{3}\) \d{3}-\d{4}$/.test(value);
    }),
  representative1_job: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  representative1_passport_series: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-passport-series', 'Серия паспорта — 4 цифры', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{4}$/.test(value);
    }),
  representative1_passport_number: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-passport-number', 'Номер паспорта — 6 цифр', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{6}$/.test(value);
    }),
  representative1_passport_issued_by: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  representative1_passport_issued_date: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем')
    .nullable(),
  representative2_name: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  representative2_phone: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-phone', 'Телефон формата +7 (XXX) XXX-XXXX', function (value) {
      if (!value) return true; // Allow empty string
      return /^\+7 \(\d{3}\) \d{3}-\d{4}$/.test(value);
    }),
  representative2_job: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  representative2_passport_series: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-passport-series', 'Серия паспорта — 4 цифры', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{4}$/.test(value);
    }),
  representative2_passport_number: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === '' ? '' : value;
    })
    .test('is-valid-passport-number', 'Номер паспорта — 6 цифр', function (value) {
      if (!value) return true; // Allow empty string
      return /^\d{6}$/.test(value);
    }),
  representative2_passport_issued_by: yup
    .string()
    .max(255, 'Максимум 255 символов')
    .nullable(),
  representative2_passport_issued_date: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Введите корректную дату')
    .max(new Date(), 'Дата не может быть в будущем')
    .nullable(),
  documents_delivered: yup
    .boolean()
    .nullable(),
  specialty: yup
    .string()
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
    )
    .required('Специальность обязательна'),
  education_base: yup
    .string()
    .nullable(),
  grade_russian: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .nullable(),
  grade_biology: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .nullable(),
  grade_chemistry: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .nullable(),
  grade_math: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .nullable(),
  grade_language: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .nullable(),
  grade_physics: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .oneOf([3, 4, 5], 'Оценка должна быть 3, 4 или 5')
    .nullable(),
  average_grade: yup
    .number()
    .required('Средний балл обязателен')
    .min(3.00, 'Средний балл от 3.00')
    .max(5.00, 'Средний балл до 5.00')
    .typeError('Введите средний бал в формате 4,85'),
  admission_type: yup
    .string()
    .oneOf(['бюджет', 'коммерция', 'none'], 'Выберите тип поступления')
    .required('Тип поступления обязателен'),
    // .nullable(),
  needs_dormitory: yup
    .boolean()
    .nullable(),
  priority_enrollment: yup
    .string()
    .oneOf(
      ['heroes_rf', 'svo_participants', 'covid_med_workers', 'none'],
      'Выберите корректный вариант'
    )
    .required('Выберите вариант первоочередного зачисления'),
  preferential_enrollment: yup
    .string()
    .oneOf(
      [
        'orphans',
        'disabled',
        'veterans',
        'low_income_disabled',
        'chernobyl',
        'military_personnel',
        'none',
      ],
      'Выберите корректный вариант'
    )
    .required('Выберите вариант преимущественного зачисления'),
});