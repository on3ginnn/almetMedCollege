/*
File: src/pages/ApplicantForm.jsx
Description: Page for applicants to fill in their personal and academic data.
*/

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

const initialState = {
  fullName: '',
  citizenship: '',
  nationality: '',
  birthDate: '',
  birthPlace: '',
  residenceAddress: '',
  certificateSeries: '',
  certificateDate: '',
  certificateInstitution: '',
  passportSeries: '',
  passportNumber: '',
  passportIssuedBy: '',
  passportIssueDate: '',
  inn: '',
  snils: '',
  medicalPolicy: '',
  hasMilitaryRecord: 'no',
  phoneStudent: '',
  motherName: '',
  motherPhone: '',
  motherWorkplace: '',
  motherPosition: '',
  fatherName: '',
  fatherPhone: '',
  fatherWorkplace: '',
  fatherPosition: '',
  hasMedicalAgreement: 'no',
  medicalOrgName: '',
  scoreRussian: '',
  scoreBiology: '',
  scoreChemistry: '',
  scoreMath: '',
  scoreForeign: '',
  scorePhysics: '',
  averageScore: '',
  documentsSubmitted: 'original',
  fundingType: 'budget',
  appliedViaGosuslugi: 'no',
  needsDormitory: 'no',
};

export const ApplicantForm = () => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with actual API call to submit formData
    fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          alert('Заявка успешно отправлена');
          setFormData(initialState);
        } else {
          alert('Ошибка при отправке заявки');
        }
      })
      .catch(() => alert('Ошибка сети'));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Анкета на поступление
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Фамилия Имя Отчество"
              name="fullName"
              value={formData.fullName}
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
              fullWidth
              type="date"
              label="Дата рождения"
              InputLabelProps={{ shrink: true }}
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Место рождения"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Адрес (место жительства)"
              name="residenceAddress"
              value={formData.residenceAddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Серия, № аттестата"
              name="certificateSeries"
              value={formData.certificateSeries}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="date"
              label="Дата окончания"
              InputLabelProps={{ shrink: true }}
              name="certificateDate"
              value={formData.certificateDate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Наименование учебного заведения"
              name="certificateInstitution"
              value={formData.certificateInstitution}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Паспорт: серия"
              name="passportSeries"
              value={formData.passportSeries}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Паспорт: номер"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Кем выдан"
              name="passportIssuedBy"
              value={formData.passportIssuedBy}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Дата выдачи паспорта"
              InputLabelProps={{ shrink: true }}
              name="passportIssueDate"
              value={formData.passportIssueDate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ИНН"
              name="inn"
              value={formData.inn}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="СНИЛС"
              name="snils"
              value={formData.snils}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Медицинский полис (организация)"
              name="medicalPolicy"
              value={formData.medicalPolicy}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Приписное свидетельство</FormLabel>
              <RadioGroup
                row
                name="hasMilitaryRecord"
                value={formData.hasMilitaryRecord}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Да" />
                <FormControlLabel value="no" control={<Radio />} label="Нет" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="№ телефона студента"
              name="phoneStudent"
              value={formData.phoneStudent}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ФИО, № телефона мамы"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Место работы мамы, должность"
              name="motherWorkplace"
              value={formData.motherWorkplace}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ФИО, № телефона папы"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Место работы папы, должность"
              name="fatherWorkplace"
              value={formData.fatherWorkplace}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Наличие договора или ходатайства с медицинской организацией</FormLabel>
              <RadioGroup
                row
                name="hasMedicalAgreement"
                value={formData.hasMedicalAgreement}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Да" />
                <FormControlLabel value="no" control={<Radio />} label="Нет" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {formData.hasMedicalAgreement === 'yes' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Наименование мед. организации"
                name="medicalOrgName"
                value={formData.medicalOrgName}
                onChange={handleChange}
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Оценка по аттестату - Русский язык"
              name="scoreRussian"
              value={formData.scoreRussian}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Оценка по аттестату - Биология"
              name="scoreBiology"
              value={formData.scoreBiology}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Оценка по аттестату - Химия"
              name="scoreChemistry"
              value={formData.scoreChemistry}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Оценка по аттестату - Математика"
              name="scoreMath"
              value={formData.scoreMath}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Оценка по аттестату - Иностранный язык"
              name="scoreForeign"
              value={formData.scoreForeign}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Оценка по аттестату - Физика"
              name="scorePhysics"
              value={formData.scorePhysics}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Средний балл аттестата"
              name="averageScore"
              value={formData.averageScore}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Подали документы</InputLabel>
              <Select
                name="documentsSubmitted"
                value={formData.documentsSubmitted}
                label="Подали документы"
                onChange={handleChange}
              >
                <MenuItem value="original">Оригинал</MenuItem>
                <MenuItem value="copy">Копия</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Бюджет/Коммерция</InputLabel>
              <Select
                name="fundingType"
                value={formData.fundingType}
                label="Бюджет/Коммерция"
                onChange={handleChange}
              >
                <MenuItem value="budget">Бюджет</MenuItem>
                <MenuItem value="commercial">Коммерция</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Подача заявления через Госуслуги РФ</FormLabel>
              <RadioGroup
                row
                name="appliedViaGosuslugi"
                value={formData.appliedViaGosuslugi}
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
                name="needsDormitory"
                value={formData.needsDormitory}
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
}
