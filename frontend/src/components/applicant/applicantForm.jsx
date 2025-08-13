import React, { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Paper,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  AlertTitle,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplicantsStore } from '../../stores/applicantsStore';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { schema } from '../../validation/applicant/applicantValidation';
import { GroupTitle } from './applicantFormTags/applicantGroupTitle';
import { SelectField } from './applicantFormTags/applicantSelectField';
import { FormCheckbox } from './applicantFormTags/applicantCheckbox';
import { FormTextField } from './applicantFormTags/applicantTextField';
import { FormTextFieldMask } from './applicantFormTags/applicantTextFieldMask';
import { useUserStore } from '../../stores/userStore';
import { theme as customTheme } from '../../theme';

export const ApplicantForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const { 
    submitApplicant,
    updateApplicant,
    getApplicantById,
    selectedApplicant,
  } = useApplicantsStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const { currentUser } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
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
      medical_contract: false,
      gosuslugi: false,
      student_phone: '',
      student_email: '',
      representative1_name: '',
      representative1_phone: '',
      representative1_job: '',
      representative1_passport_series: '',
      representative1_passport_number: '',
      representative1_passport_issued_by: '',
      representative1_passport_issued_date: '',
      representative2_name: '',
      representative2_phone: '',
      representative2_job: '',
      representative2_passport_series: '',
      representative2_passport_number: '',
      representative2_passport_issued_by: '',
      representative2_passport_issued_date: '',
      documents_delivered: false,
      documents_submitted: 'none',
      specialty: '',
      study_form: '',
      grade_russian: null,
      grade_biology: null,
      grade_chemistry: null,
      grade_math: null,
      grade_language: null,
      grade_physics: null,
      admission_type: '',
      needs_dormitory: false,
      priority_enrollment: 'none',
      preferential_enrollment: 'none',
    },
  });
  const selectedSpecialty = watch('specialty');

  useEffect(() => {
    if (selectedSpecialty === 'nursing_zaochno' || selectedSpecialty === 'pharmacy') {
      setValue('admission_type', 'коммерция');
    }
  }, [selectedSpecialty]);

  useEffect(() => {
    if (isEditMode && id) {
      getApplicantById(id); // Fetch applicant data
    }
  }, [id, isEditMode, getApplicantById]);

  useEffect(() => {
    if (isEditMode && id && selectedApplicant) {
      reset(applicantToFormData(selectedApplicant)); // Populate form with data
    }
  }, [id, isEditMode, selectedApplicant, reset]);

  function applicantToFormData(applicant) {
    console.log(applicant.specialty);
    return {
      ...applicant,
      snils: applicant.snils ? `${applicant.snils.slice(0, 3)}-${applicant.snils.slice(3, 6)}-${applicant.snils.slice(6, 9)}-${applicant.snils.slice(9)}` : '',
      passport_division_code: applicant.passport_division_code ? `${applicant.passport_division_code.slice(0, 3)}-${applicant.passport_division_code.slice(3)}` : '',
      birth_date: applicant.birth_date ? format(new Date(applicant.birth_date), 'yyyy-MM-dd') : '',
      passport_registration_date: applicant.passport_registration_date ? format(new Date(applicant.passport_registration_date), 'yyyy-MM-dd') : '',
      certificate_issued_date: applicant.certificate_issued_date ? format(new Date(applicant.certificate_issued_date), 'yyyy-MM-dd') : '',
      passport_issued_date: applicant.passport_issued_date ? format(new Date(applicant.passport_issued_date), 'yyyy-MM-dd') : '',
      representative1_passport_issued_date: applicant.representative1_passport_issued_date ? format(new Date(applicant.representative1_passport_issued_date), 'yyyy-MM-dd') : '',
      representative2_passport_issued_date: applicant.representative2_passport_issued_date ? format(new Date(applicant.representative2_passport_issued_date), 'yyyy-MM-dd') : '',
      specialty: applicant.specialty,
      // grade_russian: applicant.grade_russian ?? null,
      // grade_biology: applicant.grade_biology ?? null,
      // grade_chemistry: applicant.grade_chemistry ?? null,
    };
  }

  function formatSnils(snils) {
    if (!snils) return '';
    return `${snils.slice(0, 3)}-${snils.slice(3, 6)}-${snils.slice(6, 9)}-${snils.slice(9)}`;
  }

  function formatDivisionCode(code) {
    if (!code) return '';
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  }
  
  const onError = (errors) => {
    console.error('Ошибки валидации', errors);
  };

  const onSubmit = async (data) => {
    console.log("submiting...")
    setIsSubmitting(true);
    try {
      let studyForm = data.specialty === 'nursing_zaochno' ? 'очно-заочная' : 'очная';
      let admission_type = data.specialty === 'nursing_zaochno' || data.specialty === 'pharmacy' ? 'коммерция' : data.admission_type;
      console.log(data.specialty);
      const formattedData = {
        ...data,
        specialty: data.specialty,
        study_form: studyForm,
        admission_type: admission_type,
        snils: data.snils ? data.snils.replace(/-/g, '') : '',
        passport_division_code: data.passport_division_code ? data.passport_division_code.replace(/-/g, '') : '',
        passport_series: data.passport_series || '',
        passport_number: data.passport_number || '',
        inn: data.inn || '',
        student_phone: data.student_phone || '',
        student_email: data.student_email || '',
        representative1_phone: data.representative1_phone || '',
        representative1_passport_series: data.representative1_passport_series || '',
        representative1_passport_number: data.representative1_passport_number || '',
        representative2_phone: data.representative2_phone || '',
        representative2_passport_series: data.representative2_passport_series || '',
        representative2_passport_number: data.representative2_passport_number || '',
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
        representative1_passport_issued_date: data.representative1_passport_issued_date
          ? format(new Date(data.representative1_passport_issued_date), 'yyyy-MM-dd')
          : null,
        representative2_passport_issued_date: data.representative2_passport_issued_date
          ? format(new Date(data.representative2_passport_issued_date), 'yyyy-MM-dd')
          : null,
      };

        console.log(isEditMode)
        console.log(id)


      if (isEditMode && id) {
        await updateApplicant(id, formattedData);
        toast.success('Анкета успешно обновлена!', { autoClose: 5000 });
        navigate(`/applicant/${id}`);
      } else {
        await submitApplicant(formattedData);
        reset();
        if (currentUser && currentUser.role === 'admin') {
          navigate(`/applicant/all`);
        } else {
          setOpenSuccessModal(true);          
          setTimeout(() => window.location.href = 'https://almetmed.ru/', 5000);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || 'Ошибка при отправке анкеты';
      console.error('Submission error:', errorMessage, error);
      toast.error(`Ошибка: ${errorMessage}`, { autoClose: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputSize = { xs: 'small', sm: 'medium' };

  var specialtyOptions = [
    { value: 'pharmacy', label: 'Фармация - на базе 9 класса' },
    { value: 'lab_diagnostics', label: 'Лабораторная диагностика - на базе 9 класса' },

    // { value: 'nursing', label: 'Сестринское дело - на базе 9 класса' },
    // { value: 'nursing_zaochno', label: 'Сестринское дело - очно-заочная' },
    // { value: 'midwifery', label: 'Акушерское дело - на базе 9 класса' },
    // { value: 'medical_treatment', label: 'Лечебное дело - на базе 9 класса' },
    // { value: 'medical_treatment_11', label: 'Лечебное дело - на базе 11 класса' },
  ];

  if (isEditMode) {
    specialtyOptions = [...specialtyOptions,
      { value: 'nursing', label: 'Сестринское дело - на базе 9 класса' },
      { value: 'nursing_zaochno', label: 'Сестринское дело - очно-заочная' },
      { value: 'midwifery', label: 'Акушерское дело - на базе 9 класса' },
      { value: 'medical_treatment', label: 'Лечебное дело - на базе 9 класса' },
      { value: 'medical_treatment_11', label: 'Лечебное дело - на базе 11 класса' },
    ]
  }

  const fullAdmissionTypeOptions = [
    { value: 'бюджет', label: 'Бюджет' },
    { value: 'коммерция', label: 'Коммерция' },
  ];

  const limitedAdmissionTypeOptions = [
    { value: 'коммерция', label: 'Коммерция' },
  ];

  const admissionTypeOptions =
    selectedSpecialty === 'nursing_zaochno' || selectedSpecialty === 'pharmacy'
      ? limitedAdmissionTypeOptions
      : fullAdmissionTypeOptions;

  const priorityEnrollmentOptions = [
    { value: 'heroes_rf', label: 'Герои РФ, награжденные тремя орденами Мужества' },
    { value: 'svo_participants', label: 'Участники СВО и их дети' },
    { value: 'covid_med_workers', label: 'Дети умерших от COVID-19 медработников' },
    { value: 'none', label: 'Не отношусь' },
  ];

  const preferentialEnrollmentOptions = [
    { value: 'orphans', label: 'Дети-сироты' },
    { value: 'disabled', label: 'Дети-инвалиды, инвалиды 1-2 группы' },
    { value: 'veterans', label: 'Ветераны боевых действий' },
    { value: 'low_income_disabled', label: 'Дети из малоимущих семей с родителями-инвалидами' },
    { value: 'chernobyl', label: 'Пострадавшие от Чернобыля' },
    { value: 'military_personnel', label: 'Военнослужащие и их дети' },
    { value: 'none', label: 'Не отношусь' },
  ];

  const graduationYearOptions = () =>
    Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 1980 + i)
      .sort((a, b) => b - a) // Sort in descending order
      .map((year) => ({
        value: year,
        label: year.toString(),
      }));

  const handleModalClose = () => {
    setOpenSuccessModal(false);
    window.location.href = 'https://almetmed.ru/';
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        pt: { xs: 3, sm: 5 },
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: '100%', sm: 1200 },
          margin: '0 auto',
          p: { xs: 0, sm: 3 },
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: theme.palette.text.primary,
          }}
        >
          {isEditMode ? 'Редактирование анкеты' : 'Анкета на поступление'}
        </Typography>

        <Alert
          severity="info"
          sx={{
            mt: 1,
            // backgroundColor: theme.palette.paper,
            // color: theme.palette.primary.dark, // #2196f3
            // border: `1px solid ${theme.palette.primary.main}`, // #2962ff
            borderRadius: 1,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            bgcolor: customTheme.palette.primary.fill,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: theme.spacing(2),
            '& .MuiAlert-icon': {
              color: theme.palette.primary.main, // #2962ff for the icon
            },
          }}
        >
          <Typography variant="body1">
            Если данные для заполнения отсутствуют, оставьте поле пустым.
          </Typography>
        </Alert>

        <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
          <Grid columns={{ xs: 6, sm: 6 }} container spacing={{ xs: 2, md: 2 }}>
            {/* Admission Details */}
            <GroupTitle title='Детали поступления' />
            <SelectField
              name="specialty"
              label="Специальность*"
              options={specialtyOptions}
              gridSize={{ xs: 6, md: 3 }}
              control={control}
              formControlError={!!errors.specialty}
              formHelperText={errors.specialty?.message}
              inputSize={inputSize}
            />
            <SelectField
              name="admission_type"
              label="Бюджет/коммерция*"
              options={admissionTypeOptions}
              gridSize={{ xs: 6, md: 3 }}
              control={control}
              formControlError={!!errors.admission_type}
              formHelperText={errors.admission_type?.message}
              inputSize={inputSize}
            />
            <SelectField
              name="priority_enrollment"
              label="Первоочередное зачисление"
              options={priorityEnrollmentOptions}
              gridSize={{ xs: 6, md: 3 }}
              control={control}
              formControlError={!!errors.priority_enrollment}
              formHelperText={errors.priority_enrollment?.message}
              inputSize={inputSize}
            />
            <SelectField
              name="preferential_enrollment"
              label="Преимущественное право"
              options={preferentialEnrollmentOptions}
              gridSize={{ xs: 6, md: 3 }}
              control={control}
              formControlError={!!errors.preferential_enrollment}
              formHelperText={errors.preferential_enrollment?.message}
              inputSize={inputSize}
            />
            <FormCheckbox 
              name="needs_dormitory"
              label="Нуждается в общежитии"
              gridSize={{ xs: 6}}
              control={control}
            />
            <FormCheckbox 
              name="military_id"
              label="Приписное свидетельство (для юношей)"
              gridSize={{ xs: 6}}
              control={control}
            />
            <FormCheckbox 
              name="medical_contract"
              label="Наличие договора или ходатайства с медицинской организацией"
              gridSize={{ xs: 6}}
              control={control}
            />
            <FormCheckbox 
              name="gosuslugi"
              label="Подали через госуслуги РФ"
              gridSize={{ xs: 6}}
              control={control}
            />
            {/* Personal Info */}
            <GroupTitle title='Личные данные абитуриента' />
            <FormTextField 
              name="full_name"
              label="ФИО*"
              gridSize={{ xs: 6, md: 3 }}
              control={control}
              textFieldError={!!errors.full_name}
              textFieldHelperText={errors.full_name?.message}
            />
            <FormTextField 
              name="citizenship"
              label="Гражданство"
              gridSize={{ xs: 3, md: 1.5 }}
              control={control}
              textFieldError={!!errors.citizenship}
              textFieldHelperText={errors.citizenship?.message}
            />
            <FormTextField 
              name="nationality"
              label="Национальность"
              gridSize={{ xs: 3, md: 1.5 }}
              control={control}
              textFieldError={!!errors.nationality}
              textFieldHelperText={errors.nationality?.message}
            />
            <Grid size={{ xs: 6, sm: 2 }}>
              <Controller
                name="birth_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Дата рождения*"
                    InputLabelProps={{ shrink: true }}
                    size={inputSize.sm}
                    error={!!errors.birth_date}
                    helperText={errors.birth_date?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <FormTextField 
              name="birth_place"
              label="Место рождения"
              gridSize={{ xs: 6, md: 4 }}
              control={control}
              textFieldError={!!errors.birth_place}
              textFieldHelperText={errors.birth_place?.message}
            />
            <Grid size={{ xs: 12 }}>
              <Controller
                name="address_actual"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Фактический адрес*"
                    multiline
                    rows={2}
                    size={inputSize.sm}
                    error={!!errors.address_actual}
                    helperText={errors.address_actual?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>

            {/* Passport Info */}
            <GroupTitle title='Паспортные данные' />
            <FormTextFieldMask 
              name="passport_series"
              label="Серия паспорта"
              mask="9999"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.passport_series}
              textFieldHelperText={errors.passport_series?.message}
            />
            <FormTextFieldMask 
              name="passport_number"
              label="Номер паспорта"
              mask="999999"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.passport_number}
              textFieldHelperText={errors.passport_number?.message}
            />
            <FormTextFieldMask 
              name="passport_division_code"
              label="Код подразделения"
              mask="999-999"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.passport_division_code}
              textFieldHelperText={errors.passport_division_code?.message}
            />
            <Grid size={{ xs: 3, sm: 2 }}>
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
                    size={inputSize.sm}
                    error={!!errors.passport_issued_date}
                    helperText={errors.passport_issued_date?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <FormTextField
              name="passport_issued_by"
              label="Кем выдан"
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              textFieldError={!!errors.passport_issued_by}
              textFieldHelperText={errors.passport_issued_by?.message}
            />
            <Grid size={{ xs: 6, sm: 2 }}>
              <Controller
                name="passport_registration_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Дата регистрации прописки"
                    InputLabelProps={{ shrink: true }}
                    size={inputSize.sm}
                    error={!!errors.passport_registration_date}
                    helperText={errors.passport_registration_date?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
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
                    size={inputSize.sm}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>

            {/* Education Info */}
            <GroupTitle title='Образование' />
            <FormTextFieldMask 
              name="certificate_series"
              label="Номер аттестата"
              mask="**************"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.certificate_series}
              textFieldHelperText={errors.certificate_series?.message}
            />
            <Grid size={{ xs: 3, sm: 2 }}>
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
                    size={inputSize.sm}
                    error={!!errors.certificate_issued_date}
                    helperText={errors.certificate_issued_date?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <SelectField
              name="graduation_year"
              label="Год окончания"
              options={graduationYearOptions()}
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              formControlError={!!errors.graduation_year}
              formHelperText={errors.graduation_year?.message}
              inputSize={inputSize}
            />
            <FormTextField
              name="graduation_institution"
              label="Учебное заведение"
              gridSize={{ xs: 6, md: 6 }}
              control={control}
              textFieldError={!!errors.graduation_institution}
              textFieldHelperText={errors.graduation_institution?.message}
            />

            {/* Contact Info */}
            <GroupTitle title='Контактные данные' />
            <FormTextFieldMask 
              name="student_phone"
              label="Телефон"
              mask="+7 (999) 999-9999"
              gridSize={{ xs: 6, md: 1.5 }}
              control={control}
              textFieldError={!!errors.student_phone}
              textFieldHelperText={errors.student_phone?.message}
            />
            <Grid size={{ xs: 6, sm: 1.5 }}>
              <Controller
                name="student_email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    size={inputSize.sm}
                    error={!!errors.student_email}
                    helperText={errors.student_email?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <FormTextFieldMask 
              name="inn"
              label="ИНН"
              mask="999999999999"
              gridSize={{ xs: 6, md: 1.5 }}
              control={control}
              textFieldError={!!errors.inn}
              textFieldHelperText={errors.inn?.message}
            />
            <FormTextFieldMask
              name="snils"
              label="СНИЛС*"
              mask="999-999-999-99"
              gridSize={{ xs: 6, md: 1.5 }}
              control={control}
              textFieldError={!!errors.snils}
              textFieldHelperText={errors.snils?.message}
            />
            <FormTextField
              name="medical_policy"
              label="Медицинский полис"
              gridSize={{ xs: 6, md: 6 }}
              control={control}
              textFieldError={!!errors.medical_policy}
              textFieldHelperText={errors.medical_policy?.message}
            />

            {/* Representative 1 Info */}
            <GroupTitle title='Данные представителя 1 (мама/жена)' />
            <FormTextField
              name="representative1_name"
              label="ФИО представителя 1"
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              textFieldError={!!errors.representative1_name}
              textFieldHelperText={errors.representative1_name?.message}
            />
            <FormTextFieldMask 
              name="representative1_phone"
              label="Телефон представителя 1"
              mask="+7 (999) 999-9999"
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              textFieldError={!!errors.representative1_phone}
              textFieldHelperText={errors.representative1_phone?.message}
            />
            <FormTextField
              name="representative1_job"
              label="Место работы и должность представителя 1"
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              textFieldError={!!errors.representative1_job}
              textFieldHelperText={errors.representative1_job?.message}
            />
            <FormTextFieldMask 
              name="representative1_passport_series"
              label="Серия паспорта"
              mask="9999"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.representative1_passport_series}
              textFieldHelperText={errors.representative1_passport_series?.message}
            />
            <FormTextFieldMask 
              name="representative1_passport_number"
              label="Номер паспорта"
              mask="999999"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.representative1_passport_number}
              textFieldHelperText={errors.representative1_passport_number?.message}
            />
            <Grid size={{ xs: 6, sm: 2 }}>
              <Controller
                name="representative1_passport_issued_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Дата выдачи"
                    InputLabelProps={{ shrink: true }}
                    size={inputSize.sm}
                    error={!!errors.representative1_passport_issued_date}
                    helperText={errors.representative1_passport_issued_date?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <FormTextField
              name="representative1_passport_issued_by"
              label="Кем выдан"
              gridSize={{ xs: 6, md: 6 }}
              control={control}
              textFieldError={!!errors.representative1_passport_issued_by}
              textFieldHelperText={errors.representative1_passport_issued_by?.message}
            />

            {/* Representative 2 Info */}
            <GroupTitle title='Данные представителя 2 (папа/муж)' />
            <FormTextField
              name="representative2_name"
              label="ФИО представителя 2"
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              textFieldError={!!errors.representative2_name}
              textFieldHelperText={errors.representative2_name?.message}
            />
            <FormTextFieldMask 
              name="representative2_phone"
              label="Телефон представителя 2"
              mask="+7 (999) 999-9999"
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              textFieldError={!!errors.representative2_phone}
              textFieldHelperText={errors.representative2_phone?.message}
            />
            <FormTextField
              name="representative2_job"
              label="Место работы и должность представителя 2"
              gridSize={{ xs: 6, md: 2 }}
              control={control}
              textFieldError={!!errors.representative2_job}
              textFieldHelperText={errors.representative2_job?.message}
            />
            <FormTextFieldMask 
              name="representative2_passport_series"
              label="Серия паспорта"
              mask="9999"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.representative2_passport_series}
              textFieldHelperText={errors.representative2_passport_series?.message}
            />
            <FormTextFieldMask 
              name="representative2_passport_number"
              label="Номер паспорта"
              mask="999999"
              gridSize={{ xs: 3, md: 2 }}
              control={control}
              textFieldError={!!errors.representative2_passport_number}
              textFieldHelperText={errors.representative2_passport_number?.message}
            />
            <Grid size={{ xs: 6, sm: 2 }}>
              <Controller
                name="representative2_passport_issued_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Дата выдачи"
                    InputLabelProps={{ shrink: true }}
                    size={inputSize.sm}
                    error={!!errors.representative2_passport_issued_date}
                    helperText={errors.representative2_passport_issued_date?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Grid>
            <FormTextField
              name="representative2_passport_issued_by"
              label="Кем выдан"
              gridSize={{ xs: 6, md: 6 }}
              control={control}
              textFieldError={!!errors.representative2_passport_issued_by}
              textFieldHelperText={errors.representative2_passport_issued_by?.message}
            />

            {/* Grades */}
            <GroupTitle title='Оценки' />
            {[
              { name: 'grade_russian', label: 'Русский язык' },
              { name: 'grade_biology', label: 'Биология' },
              { name: 'grade_chemistry', label: 'Химия' },
              { name: 'grade_math', label: 'Математика' },
              { name: 'grade_language', label: 'Иностранный язык' },
              { name: 'grade_physics', label: 'Физика' },
            ].map((grade) => (
              <Grid size={{ xs: 3, sm: 1 }} key={grade.name}>
                <Controller
                  name={grade.name}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors[grade.name]}>
                      <InputLabel>{grade.label}</InputLabel>
                      <Select
                        {...field}
                        label={grade.label}
                        size={inputSize.sm}
                        value={field.value ?? ''}
                        sx={{ borderRadius: 2 }}
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

            <Grid size={{ xs: 6 }}>
              <Controller
                name="average_grade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Средний балл"
                    type="number"
                    inputProps={{ step: 0.01, min: 3.00, max: 5.00 }}
                    size={inputSize.sm}
                    error={!!errors.average_grade}
                    helperText={errors.average_grade?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }}}
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }} sx={{ mt: { xs: 3, sm: 4 } }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  borderRadius: 2,
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  boxShadow: '0 2px 6px rgba(25, 75, 205, 0.2)',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    boxShadow: '0 4px 12px rgba(25, 75, 205, 0.3)',
                  },
                  '&:disabled': {
                    bgcolor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                  },
                  transition: 'all 0.2s',
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Отправка...
                  </>
                ) : isEditMode ? (
                  'Сохранить изменения'
                ) : (
                  'Отправить заявку'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <ToastContainer position="top-right" autoClose={5000} />

        <Dialog
          open={openSuccessModal}
          onClose={handleModalClose}
          aria-labelledby="success-dialog-title"
          aria-describedby="success-dialog-description"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 2,
              p: { xs: 2, sm: 3 },
              maxWidth: { xs: '90%', sm: 500 },
            },
          }}
        >
          <DialogTitle id="success-dialog-title" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            Успешная отправка
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="success-dialog-description"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: theme.palette.text.secondary }}
            >
              Анкета успешно отправлена! Вам необходимо подойти с документами в приемную комиссию колледжа.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleModalClose}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
              }}
            >
              Вернуться на сайт
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};