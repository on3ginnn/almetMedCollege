// Redesigned ApplicantDetails.jsx with all model fields included
import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  ContactPhone as ContactPhoneIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  FamilyRestroom as FamilyRestroomIcon,
  HomeWork as HomeWorkIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicantsStore } from '../../stores/applicantsStore';

const displayBoolean = (value) => (value ? 'Да' : 'Нет');

const InfoRow = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography variant="body1"><strong>{label}:</strong> {value || '-'}</Typography>
  </Grid>
);

const Section = ({ icon, title, children }) => {
  const theme = useTheme();
  return (
    <Accordion defaultExpanded sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 1, mb: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.grey[100], px: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: theme.palette.background.paper }}>
        <Card sx={{ borderRadius: 2, boxShadow: 0 }}>
          <CardContent>
            <Grid container spacing={2}>{children}</Grid>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};

export const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { selectedApplicant, getApplicantById, loading, error } = useApplicantsStore();

  useEffect(() => { getApplicantById(id); }, [id, getApplicantById]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /><Typography variant="h6" mt={2}>Загрузка...</Typography></Box>;
  if (error || !selectedApplicant) return <Box sx={{ textAlign: 'center', py: 5 }}><Typography variant="h6" color="error">{error || 'Абитуриент не найден'}</Typography><Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/applicant/all')}>Назад</Button></Box>;

  const categoryText = (map, key) => map[key] || '-';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 1 }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Tooltip title="Назад к списку"><IconButton onClick={() => navigate('/applicant/all')} sx={{ mr: 1 }}><ArrowBackIcon /></IconButton></Tooltip>
          <Typography variant="h6" fontWeight="bold">{selectedApplicant.full_name}</Typography>
          <Box flexGrow={1} />
          <Tooltip title="Редактирование отключено"><span><IconButton disabled><EditIcon /></IconButton></span></Tooltip>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        <Section icon={<HomeWorkIcon color="primary" />} title="Детали поступления">
          <InfoRow label="Специальность" value={selectedApplicant.specialty} />
          <InfoRow label="Тип поступления" value={selectedApplicant.admission_type} />
          <InfoRow label="Нуждается в общежитии" value={displayBoolean(selectedApplicant.needs_dormitory)} />
          <InfoRow label="Документы сданы" value={displayBoolean(selectedApplicant.documents_delivered)} />
          <InfoRow label="Мед. договор" value={displayBoolean(selectedApplicant.has_medical_contract)} />
          <InfoRow label="Приписное" value={displayBoolean(selectedApplicant.military_id)} />
        </Section>

        <Section icon={<PersonIcon color="primary" />} title="Личные данные">
          <InfoRow label="Гражданство" value={selectedApplicant.citizenship} />
          <InfoRow label="Национальность" value={selectedApplicant.nationality} />
          <InfoRow label="Дата рождения" value={selectedApplicant.birth_date} />
          <InfoRow label="Место рождения" value={selectedApplicant.birth_place} />
          <InfoRow label="Адрес по паспорту" value={selectedApplicant.address} />
          <InfoRow label="Фактический адрес" value={selectedApplicant.address_actual} />
          <InfoRow label="Телефон" value={selectedApplicant.student_phone} />
          <InfoRow label="Email" value={selectedApplicant.student_email} />
        </Section>

        <Section icon={<ContactPhoneIcon color="info" />} title="Контактные данные">
          <InfoRow label="ИНН" value={selectedApplicant.inn} />
          <InfoRow label="СНИЛС" value={selectedApplicant.snils} />
          <InfoRow label="Полис" value={selectedApplicant.medical_policy} />
        </Section>

        <Section icon={<BadgeIcon color="primary" />} title="Паспортные данные">
          <InfoRow label="Серия и номер" value={`${selectedApplicant.passport_series || ''} ${selectedApplicant.passport_number || ''}`} />
          <InfoRow label="Кем выдан" value={selectedApplicant.passport_issued_by} />
          <InfoRow label="Дата выдачи" value={selectedApplicant.passport_issued_date} />
          <InfoRow label="Код подразделения" value={selectedApplicant.passport_division_code} />
          <InfoRow label="Дата регистрации" value={selectedApplicant.passport_registration_date} />
        </Section>

        <Section icon={<SchoolIcon color="secondary" />} title="Образование">
          <InfoRow label="Аттестат" value={selectedApplicant.certificate_series} />
          <InfoRow label="Дата выдачи" value={selectedApplicant.certificate_issued_date} />
          <InfoRow label="Учебное заведение" value={selectedApplicant.graduation_institution} />
          <InfoRow label="Год окончания" value={selectedApplicant.graduation_year} />
        </Section>

        <Section icon={<GradeIcon color="secondary" />} title="Оценки">
          <InfoRow label="Русский язык" value={selectedApplicant.grade_russian} />
          <InfoRow label="Биология" value={selectedApplicant.grade_biology} />
          <InfoRow label="Химия" value={selectedApplicant.grade_chemistry} />
          <InfoRow label="Математика" value={selectedApplicant.grade_math} />
          <InfoRow label="Иностранный язык" value={selectedApplicant.grade_language} />
          <InfoRow label="Физика" value={selectedApplicant.grade_physics} />
          <InfoRow label="Средний балл" value={selectedApplicant.average_grade} />
        </Section>

        <Section icon={<FamilyRestroomIcon color="primary" />} title="Данные матери">
          <InfoRow label="ФИО" value={selectedApplicant.mother_name} />
          <InfoRow label="Телефон" value={selectedApplicant.mother_phone} />
          <InfoRow label="Место работы" value={selectedApplicant.mother_job} />
          <InfoRow label="Серия паспорта" value={selectedApplicant.mother_passport_series} />
          <InfoRow label="Номер паспорта" value={selectedApplicant.mother_passport_number} />
          <InfoRow label="Кем выдан" value={selectedApplicant.mother_passport_issued_by} />
          <InfoRow label="Дата выдачи" value={selectedApplicant.mother_passport_issued_date} />
        </Section>

        <Section icon={<FamilyRestroomIcon color="primary" />} title="Данные отца">
          <InfoRow label="ФИО" value={selectedApplicant.father_name} />
          <InfoRow label="Телефон" value={selectedApplicant.father_phone} />
          <InfoRow label="Место работы" value={selectedApplicant.father_job} />
          <InfoRow label="Серия паспорта" value={selectedApplicant.father_passport_series} />
          <InfoRow label="Номер паспорта" value={selectedApplicant.father_passport_number} />
          <InfoRow label="Кем выдан" value={selectedApplicant.father_passport_issued_by} />
          <InfoRow label="Дата выдачи" value={selectedApplicant.father_passport_issued_date} />
        </Section>

        <Section icon={<GradeIcon color="primary" />} title="Первоочередное зачисление">
          <InfoRow
            label="Категория"
            value={categoryText({
              'heroes_rf': 'Герои РФ и награждённые орденами',
              'svo_participants': 'СВО и их дети',
              'covid_med_workers': 'Дети умерших от COVID-19 медработников',
              'none': 'Не отношусь ни к одной категории'
            }, selectedApplicant.priority_enrollment)}
          />
        </Section>

        <Section icon={<GradeIcon color="primary" />} title="Преимущественное право на зачисление">
          <InfoRow
            label="Категория"
            value={categoryText({
              'orphans': 'Сироты',
              'disabled': 'Инвалиды',
              'veterans': 'Ветераны',
              'low_income_disabled': 'Малоимущие семьи с инвалидами',
              'chernobyl': 'Пострадавшие от Чернобыля',
              'military_personnel': 'Военные и их дети',
              'none': 'Не отношусь ни к одной категории'
            }, selectedApplicant.preferential_enrollment)}
          />
        </Section>

        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Подано: {new Date(selectedApplicant.submitted_at).toLocaleString('ru-RU')}, Зачислен: {displayBoolean(selectedApplicant.enrolled)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
