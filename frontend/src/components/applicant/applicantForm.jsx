import React from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useApplicantsStore } from '../../stores/applicantsStore';
import { format } from 'date-fns'; // Import date-fns for formatting

// Validation schema
const schema = yup.object().shape({
  full_name: yup.string().required('ФИО обязательно').max(255),
  citizenship: yup.string().required('Гражданство обязательно').max(100),
  nationality: yup.string().max(100),
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
    .matches(/^\d{6}$/, 'Код подразделения должен быть 6 цифр')
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
    .required('СНИЛС обязателен')
    .transform((value) => value.replace(/-/g, '')), // Clean hyphens for backend
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

export const ApplicantForm = () => {
  const { submitApplicant } = useApplicantsStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      citizenship: '',
      nationality: '',
      birth_date: '',
      birth_place: '',
      address: '',
      address_actual: '',
      passport_division_code: '',
      passport_registration_date: '',
      certificate_series: '',
      certificate_issued_date: '',
      graduation_year: null,
      graduation_institution: '',
      passport_series: '',
      passport_number: '',
      passport_issued_by: '',
      passport_issued_date: '',
      inn: '',
      snils: '',
      medical_policy: '',
      military_id: false,
      student_phone: '',
      student_email: '',
      mother_name: '',
      mother_phone: '',
      mother_job: '',
      mother_passport_series: '',
      mother_passport_number: '',
      mother_passport_issued_by: '',
      mother_passport_issued_date: '',
      father_name: '',
      father_phone: '',
      father_job: '',
      father_passport_series: '',
      father_passport_number: '',
      father_passport_issued_by: '',
      father_passport_issued_date: '',
      documents_delivered: false,
      specialty: '',
      grade_russian: null,
      grade_biology: null,
      grade_chemistry: null,
      grade_math: null,
      grade_language: null,
      grade_physics: null,
      average_grade: '',
      admission_type: 'бюджет',
      needs_dormitory: false,
      priority_enrollment: 'none',
      preferential_enrollment: 'none',
    },
  });

  const onSubmit = async (data) => {
    try {
      // Format date fields to YYYY-MM-DD
      const formattedData = {
        ...data,
        birth_date: data.birth_date ? format(new Date(data.birth_date), 'yyyy-MM-dd') : null,
        passport_registration_date: data.passport_registration_date
          ? format(new Date(data.passport_registration_date), 'yyyy-MM-dd')
          : null,
        certificate_issued_date: data.certificate_issued_date
          ? format(new Date(data.certificate_issued_date), 'yyyy-MM-dd')
          : null,
        passport_issued_date: data.passport_issued_date
          ? format(new Date(data.passport_issued_date), 'yyyy-MM-dd')
          : null,
        mother_passport_issued_date: data.mother_passport_issued_date
          ? format(new Date(data.mother_passport_issued_date), 'yyyy-MM-dd')
          : null,
        father_passport_issued_date: data.father_passport_issued_date
          ? format(new Date(data.father_passport_issued_date), 'yyyy-MM-dd')
          : null,
        // SNILS is already cleaned by yup transform
      };

      await submitApplicant(formattedData);
      toast.success('Анкета успешно отправлена!', { autoClose: 3000 });
      reset();
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || 'Ошибка при отправке анкеты';
      console.error('Submission error:', errorMessage, error);
      toast.error(`Ошибка: ${errorMessage}`, { autoClose: 5000 });
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: { xs: '100%', sm: 800, md: 1200 },
        margin: '0 auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        Анкета на поступление
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {/* Admission Details */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Детали поступления
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="specialty"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.specialty}>
                  <InputLabel>Специальность</InputLabel>
                  <Select
                    {...field}
                    label="Специальность"
                    size="medium"
                  >
                    <MenuItem value="pharmacy_9">Фармация - на базе 9 класса</MenuItem>
                    <MenuItem value="nursing_9">Сестринское дело - на базе 9 класса</MenuItem>
                    <MenuItem value="nursing_11_part_time">
                      Сестринское дело - очно-заочная, на базе 11 класса
                    </MenuItem>
                    <MenuItem value="midwifery_9">Акушерское дело - на базе 9 класса</MenuItem>
                    <MenuItem value="lab_diagnostics_9">
                      Лабораторная диагностика - на базе 9 класса
                    </MenuItem>
                    <MenuItem value="medical_treatment_9">
                      Лечебное дело - на базе 9 класса
                    </MenuItem>
                    <MenuItem value="medical_treatment_11">
                      Лечебное дело - на базе 11 класса
                    </MenuItem>
                  </Select>
                  <FormHelperText>{errors.specialty?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="priority_enrollment"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.priority_enrollment}>
                  <InputLabel>Первоочередное зачисление</InputLabel>
                  <Select
                    {...field}
                    label="Первоочередное зачисление"
                    size="small"
                  >
                    <MenuItem value="heroes_rf">
                      Герои РФ, награжденные тремя орденами Мужества
                    </MenuItem>
                    <MenuItem value="svo_participants">
                      Участники СВО и их дети
                    </MenuItem>
                    <MenuItem value="covid_med_workers">
                      Дети умерших от COVID-19 медработников
                    </MenuItem>
                    <MenuItem value="none">Не отношусь</MenuItem>
                  </Select>
                  <FormHelperText>{errors.priority_enrollment?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="preferential_enrollment"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.preferential_enrollment}>
                  <InputLabel>Преимущественное право</InputLabel>
                  <Select
                    {...field}
                    label="Преимущественное право"
                    size="small"
                  >
                    <MenuItem value="orphans">Дети-сироты</MenuItem>
                    <MenuItem value="disabled">Дети-инвалиды, инвалиды 1-2 группы</MenuItem>
                    <MenuItem value="veterans">Ветераны боевых действий</MenuItem>
                    <MenuItem value="low_income_disabled">
                      Дети из малоимущих семей с родителями-инвалидами
                    </MenuItem>
                    <MenuItem value="chernobyl">Пострадавшие от Чернобыля</MenuItem>
                    <MenuItem value="military_personnel">
                      Военнослужащие и их дети
                    </MenuItem>
                    <MenuItem value="none">Не отношусь</MenuItem>
                  </Select>
                  <FormHelperText>{errors.preferential_enrollment?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="admission_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.admission_type}>
                  <InputLabel>Бюджет/коммерция</InputLabel>
                  <Select
                    {...field}
                    label="Бюджет/коммерция"
                    size="small"
                  >
                    <MenuItem value="бюджет">Бюджет</MenuItem>
                    <MenuItem value="коммерция">Коммерция</MenuItem>
                  </Select>
                  <FormHelperText>{errors.admission_type?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="needs_dormitory"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Нуждается в общежитии"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="documents_delivered"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Документы сданы"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="military_id"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Приписное свидетельство (для юношей)"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                />
              )}
            />
          </Grid>

          {/* Applicant Personal Info */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Личные данные абитуриента
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="full_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="ФИО"
                  size="small"
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="citizenship"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Гражданство"
                  size="small"
                  error={!!errors.citizenship}
                  helperText={errors.citizenship?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Национальность"
                  size="small"
                  error={!!errors.nationality}
                  helperText={errors.nationality?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="birth_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Дата рождения"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  error={!!errors.birth_date}
                  helperText={errors.birth_date?.message}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="birth_place"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Место рождения"
                  size="small"
                  error={!!errors.birth_place}
                  helperText={errors.birth_place?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Адрес по паспорту"
                  multiline
                  rows={2}
                  size="small"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          {/* Passport Info */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Паспортные данные
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="passport_series"
              control={control}
              render={({ field }) => (
                <InputMask mask="9999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Серия паспорта"
                      size="small"
                      error={!!errors.passport_series}
                      helperText={errors.passport_series?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="passport_number"
              control={control}
              render={({ field }) => (
                <InputMask mask="999999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Номер паспорта"
                      size="small"
                      error={!!errors.passport_number}
                      helperText={errors.passport_number?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="passport_division_code"
              control={control}
              render={({ field }) => (
                <InputMask mask="999999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Код подразделения"
                      size="small"
                      error={!!errors.passport_division_code}
                      helperText={errors.passport_division_code?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="passport_issued_by"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Кем выдан"
                  size="small"
                  error={!!errors.passport_issued_by}
                  helperText={errors.passport_issued_by?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="passport_issued_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Дата выдачи"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  error={!!errors.passport_issued_date}
                  helperText={errors.passport_issued_date?.message}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="passport_registration_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Дата регистрации"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  error={!!errors.passport_registration_date}
                  helperText={errors.passport_registration_date?.message}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address_actual"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Фактический адрес"
                  multiline
                  rows={2}
                  size="small"
                  error={!!errors.address_actual}
                  helperText={errors.address_actual?.message}
                />
              )}
            />
          </Grid>
          
          {/* Education Info */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Образование
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="certificate_series"
              control={control}
              render={({ field }) => (
                <InputMask mask="**************" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Номер аттестата"
                      size="small"
                      error={!!errors.certificate_series}
                      helperText={errors.certificate_series?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="certificate_issued_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Дата выдачи аттестата"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  error={!!errors.certificate_issued_date}
                  helperText={errors.certificate_issued_date?.message}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="graduation_year"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.graduation_year}>
                  <InputLabel>Год окончания</InputLabel>
                  <Select
                    {...field}
                    label="Год окончания"
                    size="small"
                    value={field.value ?? ''}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set max height to ~6-8 items
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Выберите
                    </MenuItem>
                    {Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i).map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.graduation_year?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="graduation_institution"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Учебное заведение"
                  size="small"
                  error={!!errors.graduation_institution}
                  helperText={errors.graduation_institution?.message}
                />
              )}
            />
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Контактные данные
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="student_phone"
              control={control}
              render={({ field }) => (
                <InputMask mask="+7 (999) 999-9999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Телефон"
                      size="small"
                      error={!!errors.student_phone}
                      helperText={errors.student_phone?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="student_email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  size="small"
                  error={!!errors.student_email}
                  helperText={errors.student_email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="inn"
              control={control}
              render={({ field }) => (
                <InputMask mask="999999999999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="ИНН"
                      size="small"
                      error={!!errors.inn}
                      helperText={errors.inn?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="snils"
              control={control}
              render={({ field }) => (
                <InputMask mask="999-999-999-99" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="СНИЛС"
                      size="small"
                      error={!!errors.snils}
                      helperText={errors.snils?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="medical_policy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Медицинский полис"
                  size="small"
                  error={!!errors.medical_policy}
                  helperText={errors.medical_policy?.message}
                />
              )}
            />
          </Grid>

          {/* Mother's Info */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Данные матери
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="mother_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="ФИО матери"
                  size="small"
                  error={!!errors.mother_name}
                  helperText={errors.mother_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="mother_phone"
              control={control}
              render={({ field }) => (
                <InputMask mask="+7 (999) 999-9999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Телефон матери"
                      size="small"
                      error={!!errors.mother_phone}
                      helperText={errors.mother_phone?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="mother_job"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Место работы матери"
                  size="small"
                  error={!!errors.mother_job}
                  helperText={errors.mother_job?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="mother_passport_series"
              control={control}
              render={({ field }) => (
                <InputMask mask="9999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Серия паспорта"
                      size="small"
                      error={!!errors.mother_passport_series}
                      helperText={errors.mother_passport_series?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="mother_passport_number"
              control={control}
              render={({ field }) => (
                <InputMask mask="999999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Номер паспорта"
                      size="small"
                      error={!!errors.mother_passport_number}
                      helperText={errors.mother_passport_number?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="mother_passport_issued_by"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Кем выдан"
                  size="small"
                  error={!!errors.mother_passport_issued_by}
                  helperText={errors.mother_passport_issued_by?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="mother_passport_issued_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Дата выдачи"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  error={!!errors.mother_passport_issued_date}
                  helperText={errors.mother_passport_issued_date?.message}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                />
              )}
            />
          </Grid>

          {/* Father's Info */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Данные отца
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="father_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="ФИО отца"
                  size="small"
                  error={!!errors.father_name}
                  helperText={errors.father_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="father_phone"
              control={control}
              render={({ field }) => (
                <InputMask mask="+7 (999) 999-9999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Телефон отца"
                      size="small"
                      error={!!errors.father_phone}
                      helperText={errors.father_phone?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="father_job"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Место работы отца"
                  size="small"
                  error={!!errors.father_job}
                  helperText={errors.father_job?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="father_passport_series"
              control={control}
              render={({ field }) => (
                <InputMask mask="9999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Серия паспорта"
                      size="small"
                      error={!!errors.father_passport_series}
                      helperText={errors.father_passport_series?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Controller
              name="father_passport_number"
              control={control}
              render={({ field }) => (
                <InputMask mask="999999" {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Номер паспорта"
                      size="small"
                      error={!!errors.father_passport_number}
                      helperText={errors.father_passport_number?.message}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="father_passport_issued_by"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Кем выдан"
                  size="small"
                  error={!!errors.father_passport_issued_by}
                  helperText={errors.father_passport_issued_by?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="father_passport_issued_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Дата выдачи"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  error={!!errors.father_passport_issued_date}
                  helperText={errors.father_passport_issued_date?.message}
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                />
              )}
            />
          </Grid>

          {/* Grades */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Оценки
            </Typography>
          </Grid>
          {[
            { name: 'grade_russian', label: 'Русский язык' },
            { name: 'grade_biology', label: 'Биология' },
            { name: 'grade_chemistry', label: 'Химия' },
            { name: 'grade_math', label: 'Математика' },
            { name: 'grade_language', label: 'Иностранный язык' },
            { name: 'grade_physics', label: 'Физика' },
          ].map((grade) => (
            <Grid item xs={12} sm={2} key={grade.name}>
              <Controller
                name={grade.name}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors[grade.name]}>
                    <InputLabel>{grade.label}</InputLabel>
                    <Select
                      {...field}
                      label={grade.label}
                      size="small"
                      value={field.value ?? ''} // Ensure null displays as empty
                    >
                      <MenuItem value="" disabled>
                        Выберите
                      </MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Select>
                    <FormHelperText>{errors[grade.name]?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={3}>
            <Controller
              name="average_grade"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Средний балл"
                  type="number"
                  inputProps={{ step: 0.1, min: 3.0, max: 5.0 }}
                  size="small"
                  error={!!errors.average_grade}
                  helperText={errors.average_grade?.message}
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: { xs: 2, sm: 3 } }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Отправить заявку
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer position="top-right" />
    </Box>
  );
};
