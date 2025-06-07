import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
  certificate_series: '',
  graduation_date: '',
  graduation_institution: '',
  passport_series: '',
  passport_number: '',
  passport_issued_by: '',
  passport_issued_date: '',
  inn: '',
  snils: '',
  medical_policy: '',
  military_id: 'no',
  student_phone: '',
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
  has_medical_contract: 'no',
  specialty: 'nursing',
  grade_russian: '',
  grade_biology: '',
  grade_chemistry: '',
  grade_math: '',
  grade_foreign: '',
  grade_physics: '',
  average_grade: '',
  documents_submitted: 'оригинал',
  admission_type: 'бюджет',
  via_gosuslugi: 'no',
  needs_dormitory: 'no',
};

export const ApplicantForm = () => {
  const [formData, setFormData] = useState(initialState);
  const { submitApplicant } = useApplicantsStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preparedData = {
      ...formData,
      military_id: formData.military_id === 'yes',
      has_medical_contract: formData.has_medical_contract === 'yes',
      via_gosuslugi: formData.via_gosuslugi === 'yes',
      needs_dormitory: formData.needs_dormitory === 'yes',
      grade_russian: parseFloat(formData.grade_russian) || 0,
      grade_biology: parseFloat(formData.grade_biology) || 0,
      grade_chemistry: parseFloat(formData.grade_chemistry) || 0,
      grade_math: parseFloat(formData.grade_math) || 0,
      grade_foreign: parseFloat(formData.grade_foreign) || 0,
      grade_physics: parseFloat(formData.grade_physics) || 0,
      average_grade: parseFloat(formData.average_grade) || 0,
    };
    submitApplicant(preparedData);
    setFormData(initialState); // Reset form after submission
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Анкета на поступление
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="ФИО"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Гражданство"
              name="citizenship"
              value={formData.citizenship}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Национальность"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Дата рождения"
              InputLabelProps={{ shrink: true }}
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Место рождения"
              name="birth_place"
              value={formData.birth_place}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Адрес места жительства"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Серия, № аттестата"
              name="certificate_series"
              value={formData.certificate_series}
              inputProps={{ maxLength: 14 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Дата окончания учебного заведения"
              InputLabelProps={{ shrink: true }}
              name="graduation_date"
              value={formData.graduation_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Наименование учебного заведения"
              name="graduation_institution"
              value={formData.graduation_institution}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Серия паспорта"
              name="passport_series"
              value={formData.passport_series}
              inputProps={{ maxLength: 4 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Номер паспорта"
              name="passport_number"
              value={formData.passport_number}
              inputProps={{ maxLength: 6 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Кем выдан"
              name="passport_issued_by"
              value={formData.passport_issued_by}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              type="date"
              label="Дата выдачи паспорта"
              InputLabelProps={{ shrink: true }}
              name="passport_issued_date"
              value={formData.passport_issued_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ИНН"
              name="inn"
              value={formData.inn}
              inputProps={{ maxLength: 12 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="СНИЛС"
              name="snils"
              value={formData.snils}
              inputProps={{ maxLength: 11 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Медицинский полис"
              name="medical_policy"
              value={formData.medical_policy}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Специальность</InputLabel>
              <Select
                name="specialty"
                value={formData.specialty}
                label="Специальность"
                onChange={handleChange}
              >
                <MenuItem value="pharmacy">Фармация</MenuItem>
                <MenuItem value="nursing">Сестринское дело</MenuItem>
                <MenuItem value="midwifery">Акушерское дело</MenuItem>
                <MenuItem value="lab_diagnostics">Лабораторная диагностика</MenuItem>
                <MenuItem value="medical_treatment">Лечебное дело</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Приписное свидетельство</FormLabel>
              <RadioGroup
                row
                name="military_id"
                value={formData.military_id}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Да" />
                <FormControlLabel value="no" control={<Radio />} label="Нет" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Телефон студента"
              name="student_phone"
              value={formData.student_phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Данные матери
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ФИО мамы"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Телефон мамы"
              name="mother_phone"
              value={formData.mother_phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Место работы и должность мамы"
              name="mother_job"
              value={formData.mother_job}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Серия паспорта мамы"
              name="mother_passport_series"
              value={formData.mother_passport_series}
              inputProps={{ maxLength: 4 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Номер паспорта мамы"
              name="mother_passport_number"
              value={formData.mother_passport_number}
              inputProps={{ maxLength: 6 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Кем выдан паспорт мамы"
              name="mother_passport_issued_by"
              value={formData.mother_passport_issued_by}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              type="date"
              label="Дата выдачи паспорта мамы"
              InputLabelProps={{ shrink: true }}
              name="mother_passport_issued_date"
              value={formData.mother_passport_issued_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Данные отца
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ФИО папы"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Телефон папы"
              name="father_phone"
              value={formData.father_phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Место работы и должность папы"
              name="father_job"
              value={formData.father_job}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Серия паспорта папы"
              name="father_passport_series"
              value={formData.father_passport_series}
              inputProps={{ maxLength: 4 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Номер паспорта папы"
              name="father_passport_number"
              value={formData.father_passport_number}
              inputProps={{ maxLength: 6 }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Кем выдан паспорт папы"
              name="father_passport_issued_by"
              value={formData.father_passport_issued_by}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              type="date"
              label="Дата выдачи паспорта папы"
              InputLabelProps={{ shrink: true }}
              name="father_passport_issued_date"
              value={formData.father_passport_issued_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Наличие договора с мед. организацией</FormLabel>
              <RadioGroup
                row
                name="has_medical_contract"
                value={formData.has_medical_contract}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Да" />
                <FormControlLabel value="no" control={<Radio />} label="Нет" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Русский язык"
              name="grade_russian"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.grade_russian}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Биология"
              name="grade_biology"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.grade_biology}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Химия"
              name="grade_chemistry"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.grade_chemistry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Математика"
              name="grade_math"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.grade_math}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Иностранный язык"
              name="grade_foreign"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.grade_foreign}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Физика"
              name="grade_physics"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.grade_physics}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Средний балл аттестата"
              name="average_grade"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={formData.average_grade}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Подали документы</InputLabel>
              <Select
                name="documents_submitted"
                value={formData.documents_submitted}
                label="Подали документы"
                onChange={handleChange}
              >
                <MenuItem value="оригинал">Оригинал</MenuItem>
                <MenuItem value="копия">Копия</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Бюджет/коммерция</InputLabel>
              <Select
                name="admission_type"
                value={formData.admission_type}
                label="Бюджет/коммерция"
                onChange={handleChange}
              >
                <MenuItem value="бюджет">Бюджет</MenuItem>
                <MenuItem value="коммерция">Коммерция</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Подача через Госуслуги</FormLabel>
              <RadioGroup
                row
                name="via_gosuslugi"
                value={formData.via_gosuslugi}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Да" />
                <FormControlLabel value="no" control={<Radio />} label="Нет" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Нуждается в общежитии</FormLabel>
              <RadioGroup
                row
                name="needs_dormitory"
                value={formData.needs_dormitory}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Да" />
                <FormControlLabel value="no" control={<Radio />} label="Нет" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              Отправить заявку
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};