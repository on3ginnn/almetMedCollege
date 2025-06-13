import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Tooltip,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  ContactPhone as ContactPhoneIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  FamilyRestroom as FamilyRestroomIcon,
  HomeWork as HomeWorkIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicantsStore } from '../../stores/applicantsStore';

// Utility to display boolean values
const displayBoolean = (value) => (value ? 'Да' : 'Нет');

export const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { selectedApplicant, getApplicantById, loading, error } = useApplicantsStore();

  useEffect(() => {
    getApplicantById(id);
  }, [id, getApplicantById]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', maxWidth: { xs: '100%', sm: 800, md: 1200 }, margin: '0 auto' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка...
        </Typography>
      </Box>
    );
  }

  if (error || !selectedApplicant) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', maxWidth: { xs: '100%', sm: 800, md: 1200 }, margin: '0 auto' }}>
        <Typography variant="h6" color="error">
          {error || 'Абитуриент не найден'}
        </Typography>
        <Tooltip title="Вернуться к списку абитуриентов">
          <Button
            variant="contained"
            onClick={() => navigate('/applicants')}
            sx={{ mt: 2, fontSize: { xs: '0.9rem', sm: '1rem' }, py: { xs: 1, sm: 0.75 } }}
          >
            Вернуться к списку
          </Button>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: { xs: '100%', sm: 800, md: 1200 },
        margin: '0 auto',
        minHeight: '100vh',
        bgcolor: 'background.paper',
        boxSizing: 'border-box',
      }}
    >
      {/* Sticky Header */}
      <AppBar
        position="sticky"
        color="default"
        elevation={2}
        sx={{
          bgcolor: 'background.paper',
          mb: 3,
          top: 0,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Вернуться к списку">
              <IconButton onClick={() => navigate('/applicant/all')} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                maxWidth: { xs: '60vw', sm: 'none' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedApplicant.full_name}
            </Typography>
          </Box>
          <Tooltip title="Редактировать (функция в разработке)">
            <span>
              <IconButton disabled sx={{ ml: 1 }}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: { xs: 'center', sm: 'left' },
          px: { xs: 1, sm: 0 },
          mb: 3,
        }}
      >
        Подробности абитуриента
      </Typography>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          boxShadow: { xs: 'none', sm: '0 4px 12px rgba(0,0,0,0.1)' },
          borderRadius: 2,
          width: '100%',
        }}
      >
        {/* Admission Details */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="admission-details-content"
            id="admission-details-header"
          >
            <HomeWorkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Детали поступления
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="admission-details-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Специальность:</strong> {selectedApplicant.specialty || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Тип поступления:</strong> {selectedApplicant.admission_type || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Нуждается в общежитии:</strong> {displayBoolean(selectedApplicant.needs_dormitory)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Документы сданы:</strong> {displayBoolean(selectedApplicant.documents_delivered)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Договор с мед. организацией:</strong> {displayBoolean(selectedApplicant.has_medical_contract)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Приписное свидетельство:</strong> {displayBoolean(selectedApplicant.military_id)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Personal Info */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="personal-info-content"
            id="personal-info-header"
          >
            <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Личные данные
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="personal-info-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>ФИО:</strong> {selectedApplicant.full_name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Гражданство:</strong> {selectedApplicant.citizenship || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Национальность:</strong> {selectedApplicant.nationality || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Дата рождения:</strong> {selectedApplicant.birth_date || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Место рождения:</strong> {selectedApplicant.birth_place || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Адрес по паспорту:</strong> {selectedApplicant.address || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Фактический адрес:</strong> {selectedApplicant.address_actual || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Телефон:</strong> {selectedApplicant.student_phone || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Email:</strong> {selectedApplicant.student_email || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Contact Info */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="contact-info-content"
            id="contact-info-header"
          >
            <ContactPhoneIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Контактные данные
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="contact-info-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>ИНН:</strong> {selectedApplicant.inn || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>СНИЛС:</strong> {selectedApplicant.snils || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Медицинский полис:</strong> {selectedApplicant.medical_policy || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Passport Info */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="passport-info-content"
            id="passport-info-header"
          >
            <BadgeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Паспортные данные
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="passport-info-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Серия и номер:</strong> {selectedApplicant.passport_series || '-'} {selectedApplicant.passport_number || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Кем выдан:</strong> {selectedApplicant.passport_issued_by || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Дата выдачи:</strong> {selectedApplicant.passport_issued_date || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Код подразделения:</strong> {selectedApplicant.passport_division_code || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Дата регистрации:</strong> {selectedApplicant.passport_registration_date || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Education Info */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="education-info-content"
            id="education-info-header"
          >
            <SchoolIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Образование
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="education-info-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Аттестат:</strong> {selectedApplicant.certificate_series || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Дата выдачи аттестата:</strong> {selectedApplicant.certificate_issued_date || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Учебное заведение:</strong> {selectedApplicant.graduation_institution || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Дата окончания:</strong> {selectedApplicant.graduation_date || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Grades */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="grades-content"
            id="grades-header"
          >
            <GradeIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Оценки
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="grades-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1"><strong>Русский язык:</strong> {selectedApplicant.grade_russian || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1"><strong>Биология:</strong> {selectedApplicant.grade_biology || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1"><strong>Химия:</strong> {selectedApplicant.grade_chemistry || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1"><strong>Математика:</strong> {selectedApplicant.grade_math || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1"><strong>Иностранный язык:</strong> {selectedApplicant.grade_language || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1"><strong>Физика:</strong> {selectedApplicant.grade_physics || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Средний балл:</strong> {selectedApplicant.average_grade || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Mother's Info */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="mother-info-content"
            id="mother-info-header"
          >
            <FamilyRestroomIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Данные матери
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="mother-info-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>ФИО:</strong> {selectedApplicant.mother_name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Телефон:</strong> {selectedApplicant.mother_phone || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Место работы и должность:</strong> {selectedApplicant.mother_job || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Серия паспорта:</strong> {selectedApplicant.mother_passport_series || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Номер паспорта:</strong> {selectedApplicant.mother_passport_number || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Кем выдан:</strong> {selectedApplicant.mother_passport_issued_by || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Дата выдачи:</strong> {selectedApplicant.mother_passport_issued_date || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Father's Info */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="father-info-content"
            id="father-info-header"
          >
            <FamilyRestroomIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Данные отца
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="father-info-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>ФИО:</strong> {selectedApplicant.father_name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Телефон:</strong> {selectedApplicant.father_phone || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Место работы и должность:</strong> {selectedApplicant.father_job || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Серия паспорта:</strong> {selectedApplicant.father_passport_series || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Номер паспорта:</strong> {selectedApplicant.father_passport_number || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Кем выдан:</strong> {selectedApplicant.father_passport_issued_by || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1"><strong>Дата выдачи:</strong> {selectedApplicant.father_passport_issued_date || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />
        
        <Divider sx={{ my: 3 }} />

        {/* Priority Enrollment */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="priority-enrollment-content"
            id="priority-enrollment-header"
          >
            <GradeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Первоочередное зачисление
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="priority-enrollment-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Категория:</strong> {
                        {
                          'heroes_rf': 'Герои Российской Федерации, лица, награжденные тремя орденами Мужества',
                          'svo_participants': 'Участники боевых действий и служащие на территориях СВО и граничащих с ними, а также их дети',
                          'covid_med_workers': 'Дети умерших от COVID-19 медработников',
                          'none': 'Не отношусь ни к одной из категорий',
                        }[selectedApplicant.priority_enrollment] || '-'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Preferential Enrollment */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="preferential-enrollment-content"
            id="preferential-enrollment-header"
          >
            <GradeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Преимущественное право на зачисление
            </Typography>
          </AccordionSummary>
          <AccordionDetails id="preferential-enrollment-content">
            <Card sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Категория:</strong> {
                        {
                          'orphans': 'Дети-сироты и дети, оставшиеся без попечения родителей',
                          'disabled': 'Дети-инвалиды, инвалиды 1-2 группы',
                          'veterans': 'Ветераны и участники боевых действий',
                          'low_income_disabled': 'Дети младше 20 лет из неполных малоимущих семей, если их родители — инвалиды I группы',
                          'chernobyl': 'Люди, пострадавшие от аварии на Чернобыльской АЭС',
                          'military_personnel': 'Военнослужащие и сотрудники силовых ведомств, а также их дети',
                          'none': 'Не отношусь ни к одной из категорий',
                        }[selectedApplicant.preferential_enrollment] || '-'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Back Button */}
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Tooltip title="Вернуться к списку абитуриентов">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/applicant/all')}
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                py: { xs: 1, sm: 0.75 },
                borderRadius: 2,
                '&:hover': { bgcolor: theme.palette.primary.dark },
              }}
            >
              Вернуться к списку
            </Button>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};