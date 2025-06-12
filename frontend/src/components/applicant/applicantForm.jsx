import React, { useState } from 'react';
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
} from '@mui/material';
import { useApplicantsStore } from '../../stores/applicantsStore';

const initialState = {
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
  graduation_date: '',
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
  has_medical_contract: false,
  documents_delivered: false,
  specialty: '',
  grade_russian: '',
  grade_biology: '',
  grade_chemistry: '',
  grade_math: '',
  grade_language: '',
  grade_physics: '',
  average_grade: '',
  admission_type: 'бюджет',
  needs_dormitory: false,
};

export const ApplicantForm = () => {
  const [formData, setFormData] = useState(initialState);
  const { submitApplicant } = useApplicantsStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preparedData = {
      ...formData,
      grade_russian: parseInt(formData.grade_russian) || null,
      grade_biology: parseInt(formData.grade_biology) || null,
      grade_chemistry: parseInt(formData.grade_chemistry) || null,
      grade_math: parseInt(formData.grade_math) || null,
      grade_language: parseInt(formData.grade_language) || null,
      grade_physics: parseInt(formData.grade_physics) || null,
      average_grade: parseFloat(formData.average_grade) || null,
    };
    submitApplicant(preparedData);
    setFormData(initialState); // Reset form after submission
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 }, // Reduced padding on mobile
        maxWidth: { xs: '100%', sm: 800, md: 1200 }, // Responsive width
        margin: '0 auto',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' }, // Smaller on mobile
          textAlign: { xs: 'center', sm: 'left' }, // Centered on mobile
        }}
      >
        Анкета на поступление
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
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
            <FormControl fullWidth>
              <InputLabel>Специальность</InputLabel>
              <Select
                required
                name="specialty"
                value={formData.specialty}
                label="Специальность"
                onChange={handleChange}
                size="small" // Smaller select on mobile
              >
                <MenuItem value="pharmacy">Фармация</MenuItem>
                <MenuItem value="nursing">Сестринское дело</MenuItem>
                <MenuItem value="midwifery">Акушерское дело</MenuItem>
                <MenuItem value="lab_diagnostics">Лабораторная диагностика</MenuItem>
                <MenuItem value="medical_treatment">Лечебное дело</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Бюджет/коммерция</InputLabel>
              <Select
                required
                name="admission_type"
                value={formData.admission_type}
                label="Бюджет/коммерция"
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="бюджет">Бюджет</MenuItem>
                <MenuItem value="коммерция">Коммерция</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="needs_dormitory"
                  checked={formData.needs_dormitory}
                  onChange={handleChange}
                />
              }
              label="Нуждается в общежитии"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="has_medical_contract"
                  checked={formData.has_medical_contract}
                  onChange={handleChange}
                />
              }
              label="Наличие договора с мед. организацией"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="military_id"
                  checked={formData.military_id}
                  onChange={handleChange}
                />
              }
              label="Приписное свидетельство"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
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
            <TextField
              required
              fullWidth
              label="ФИО"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Гражданство"
              name="citizenship"
              value={formData.citizenship}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Национальность"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Дата рождения"
              InputLabelProps={{ shrink: true }}
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Место рождения"
              name="birth_place"
              value={formData.birth_place}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Фактический адрес места жительства"
              name="address_actual"
              value={formData.address_actual}
              multiline
              rows={2}
              onChange={handleChange}
              size="small"
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
            <TextField
              required
              fullWidth
              label="Серия паспорта"
              name="passport_series"
              value={formData.passport_series}
              inputProps={{ maxLength: 4 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              required
              fullWidth
              label="Номер паспорта"
              name="passport_number"
              value={formData.passport_number}
              inputProps={{ maxLength: 6 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Код подразделения"
              name="passport_division_code"
              value={formData.passport_division_code}
              inputProps={{ maxLength: 6, pattern: '\\d{0,6}' }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              required
              fullWidth
              label="Кем выдан"
              name="passport_issued_by"
              value={formData.passport_issued_by}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Дата выдачи паспорта"
              InputLabelProps={{ shrink: true }}
              name="passport_issued_date"
              value={formData.passport_issued_date}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Дата регистрации прописки"
              InputLabelProps={{ shrink: true }}
              name="passport_registration_date"
              value={formData.passport_registration_date}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Адрес места жительства по паспорту"
              name="address"
              value={formData.address}
              multiline
              rows={2}
              onChange={handleChange}
              size="small"
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
            <TextField
              required
              fullWidth
              label="Серия и номер аттестата"
              name="certificate_series"
              value={formData.certificate_series}
              inputProps={{ maxLength: 14 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Дата выдачи аттестата"
              InputLabelProps={{ shrink: true }}
              name="certificate_issued_date"
              value={formData.certificate_issued_date}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Дата окончания учебного заведения"
              InputLabelProps={{ shrink: true }}
              name="graduation_date"
              value={formData.graduation_date}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Наименование учебного заведения"
              name="graduation_institution"
              value={formData.graduation_institution}
              onChange={handleChange}
              size="small"
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
            <TextField
              required
              fullWidth
              label="Телефон абитуриента"
              name="student_phone"
              value={formData.student_phone}
              inputProps={{ maxLength: 20 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email абитуриента"
              name="student_email"
              type="email"
              value={formData.student_email}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="ИНН"
              name="inn"
              value={formData.inn}
              inputProps={{ maxLength: 12 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="СНИЛС"
              name="snils"
              value={formData.snils}
              inputProps={{ maxLength: 11 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Медицинский полис"
              name="medical_policy"
              value={formData.medical_policy}
              onChange={handleChange}
              size="small"
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
            <TextField
              required
              fullWidth
              label="ФИО мамы"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Телефон мамы"
              name="mother_phone"
              value={formData.mother_phone}
              inputProps={{ maxLength: 20 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Место работы и должность мамы"
              name="mother_job"
              value={formData.mother_job}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              required
              fullWidth
              label="Серия паспорта мамы"
              name="mother_passport_series"
              value={formData.mother_passport_series}
              inputProps={{ maxLength: 4 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              required
              fullWidth
              label="Номер паспорта мамы"
              name="mother_passport_number"
              value={formData.mother_passport_number}
              inputProps={{ maxLength: 6 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              fullWidth
              label="Кем выдан паспорт мамы"
              name="mother_passport_issued_by"
              value={formData.mother_passport_issued_by}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              fullWidth
              type="date"
              label="Дата выдачи паспорта мамы"
              InputLabelProps={{ shrink: true }}
              name="mother_passport_issued_date"
              value={formData.mother_passport_issued_date}
              onChange={handleChange}
              size="small"
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
            <TextField
              required
              fullWidth
              label="ФИО папы"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Телефон папы"
              name="father_phone"
              value={formData.father_phone}
              inputProps={{ maxLength: 20 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Место работы и должность папы"
              name="father_job"
              value={formData.father_job}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              required
              fullWidth
              label="Серия паспорта папы"
              name="father_passport_series"
              value={formData.father_passport_series}
              inputProps={{ maxLength: 4 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              required
              fullWidth
              label="Номер паспорта папы"
              name="father_passport_number"
              value={formData.father_passport_number}
              inputProps={{ maxLength: 6 }}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              fullWidth
              label="Кем выдан паспорт папы"
              name="father_passport_issued_by"
              value={formData.father_passport_issued_by}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              fullWidth
              type="date"
              label="Дата выдачи паспорта папы"
              InputLabelProps={{ shrink: true }}
              name="father_passport_issued_date"
              value={formData.father_passport_issued_date}
              onChange={handleChange}
              size="small"
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
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Русский язык"
              name="grade_russian"
              type="number"
              inputProps={{ min: 3, max: 5, step: 1 }}
              value={formData.grade_russian}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Биология"
              name="grade_biology"
              type="number"
              inputProps={{ min: 3, max: 5, step: 1 }}
              value={formData.grade_biology}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Химия"
              name="grade_chemistry"
              type="number"
              inputProps={{ min: 3, max: 5, step: 1 }}
              value={formData.grade_chemistry}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Математика"
              name="grade_math"
              type="number"
              inputProps={{ min: 3, max: 5, step: 1 }}
              value={formData.grade_math}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Иностранный язык"
              name="grade_language"
              type="number"
              inputProps={{ min: 3, max: 5, step: 1 }}
              value={formData.grade_language}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Физика"
              name="grade_physics"
              type="number"
              inputProps={{ min: 3, max: 5, step: 1 }}
              value={formData.grade_physics}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Средний балл аттестата"
              name="average_grade"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 5 }}
              value={formData.average_grade}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: { xs: 2, sm: 3 } }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: { xs: 1.5, sm: 1 }, // Larger tap target on mobile
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Отправить заявку
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};