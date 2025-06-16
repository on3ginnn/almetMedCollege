import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Tooltip,
  AppBar,
  Toolbar,
} from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { useScheduleStore } from '../../stores/scheduleStore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useTheme } from '@mui/material/styles';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import Autocomplete from '@mui/material/Autocomplete';

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.locale('ru');

export const Schedule = () => {
  const {
    schedule,
    getSchedule,
    currentGroup,
    setCurrentGroup,
    currentDate,
    setCurrentDate,
    getGroupList,
    isLoading,
  } = useScheduleStore();
  const theme = useTheme();

  const [lessons, setLessons] = useState([]);
  const [group, setGroup] = useState(null);
  const [calendarDate, setCalendarDate] = useState(dayjs());
  const [groupList, setGroupList] = useState([]);

  const subgroups = [
    { title: 'Общая', code_name: 'all' },
    { title: '1п/г', code_name: 'first_subgroup' },
    { title: '2п/г', code_name: 'second_subgroup' },
    { title: '1 бригада', code_name: 'first_brigade' },
    { title: '2 бригада', code_name: 'second_brigade' },
    { title: '3 бригада', code_name: 'third_brigade' },
  ];

  const lessonNumbers = [
    { title: '1 - 08:00-09:30', code_name: 'n1' },
    { title: '2 - 09:40-11:10', code_name: 'n2' },
    { title: '3 - 11:40-13:10', code_name: 'n3' },
    { title: '4 - 13:20-14:50', code_name: 'n4' },
    { title: '5 - 15:00-16:30', code_name: 'n5' },
    { title: '6 - 16:40-18:10', code_name: 'n6' },
    { title: '7 - 18:20-19:50', code_name: 'n7' },
  ];

  const weekday = currentDate ? currentDate.format('dddd') : '';
  const relativeLabel = currentDate?.isToday()
    ? 'на сегодня'
    : currentDate?.isTomorrow()
    ? 'на завтра'
    : '';

  useEffect(() => {
    if (schedule) {
      setLessons(schedule.lessons || []);
    } else {
      setLessons([]);
    }
  }, [schedule]);

  useEffect(() => {
    async function fetchGroups() {
      const response = await getGroupList();
      setGroupList(response || []);
    }
    fetchGroups();
    setGroup(currentGroup);
    setCalendarDate(currentDate);
  }, [currentGroup, currentDate, getGroupList]);

  const handleGroupChange = (event, newValue) => setGroup(newValue);

  const handleDateChange = (newDate) => {
    setCalendarDate(newDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!group) return;
    setCurrentGroup(group);
    setCurrentDate(calendarDate);
    await getSchedule();
  };

  const getSubgroupTitle = (codeName) => {
    const subgroup = subgroups.find((item) => item.code_name === codeName);
    return subgroup ? subgroup.title : codeName;
  };

  const getLessonTitle = (codeName) => {
    const match = lessonNumbers.find((l) => l.code_name === codeName);
    return match ? match.title : codeName;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: '100%',
        // margin: '0 auto',
        // minHeight: '100vh',
        bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      {/* Sticky Header */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1.5, justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            Расписание
            {relativeLabel && (
              <Typography
                // component="span"
                variant="h5"
                color="primary.main"
                sx={{ ml: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                {relativeLabel}
              </Typography>
            )}
            {currentDate && (
              <Typography
                // component="span"
                variant="h5"
                color="text.secondary"
                sx={{ ml: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 'medium' }}
              >
                , {weekday}
              </Typography>
            )}
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <GroupIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontSize: '1rem',
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: theme.palette.text.primary,
                }}
              >
                {currentGroup ? currentGroup.name : 'Группа не выбрана'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{ fontSize: '1rem', color: theme.palette.text.primary }}
              >
                {currentDate ? currentDate.format('DD.MM.YYYY') : 'Дата не выбрана'}
              </Typography>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ alignItems: { xs: 'stretch', md: 'flex-start' } }}
      >
        {/* Schedule Content */}
        <Paper
          sx={{
            flex: 1,
            width: '100%',
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
          }}
        >
          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress color="primary" size={40} />
              <Typography variant="h6" color="text.primary" sx={{ mt: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Загрузка расписания...
              </Typography>
            </Box>
          ) : lessons.length === 0 ? (
            <Card
              sx={{
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
                bgcolor: 'background.paper',
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: 'none',
              }}
            >
              <EventBusyIcon color="disabled" sx={{ fontSize: { xs: 40, sm: 48 }, mb: 2 }} />
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Нет расписания
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                Для выбранной группы и даты расписание отсутствует.
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {lessons.map((lesson, index) => (
                <Card
                  key={lesson.id || index}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Lesson Number and Time */}
                      <Grid item xs={3} sm={2} sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          color="primary.main"
                          fontWeight="bold"
                          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                        >
                          {lesson.number.replace(/\D/g, '')}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          {getLessonTitle(lesson.number).split(' - ')[1]}
                        </Typography>
                      </Grid>
                      {/* Main Info */}
                      <Grid item xs={9} sm={6}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 0.5 }}
                        >
                          {lesson.major}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                        >
                          {lesson.teacher}
                        </Typography>
                      </Grid>
                      {/* Classroom and Subgroup */}
                      <Grid item xs={12} sm={4}>
                        <Stack
                          direction={{ xs: 'row', sm: 'column' }}
                          spacing={2}
                          sx={{ justifyContent: { xs: 'space-between', sm: 'flex-end' }, textAlign: { sm: 'right' } }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                            >
                              Кабинет
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                              {lesson.classroom}
                            </Typography>
                          </Box>
                          {lesson.subgroup && (
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                              >
                                Подгруппа
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight="medium"
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                              >
                                {getSubgroupTitle(lesson.subgroup)}
                            </Typography>
                          </Box>
                        )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Form Panel */}
        <Paper
          sx={{
            width: { xs: '100%', md: 320 },
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: theme.palette.text.primary }}
          >
            Параметры расписания
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                  <DateCalendar
                    value={calendarDate}
                    onChange={handleDateChange}
                    views={['month', 'day']}
                    sx={{
                      bgcolor: 'background.paper',
                      '.MuiPickersDay-root': {
                        borderRadius: '50%',
                        '&:hover': { bgcolor: theme.palette.action.hover },
                        '&.Mui-selected': {
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        },
                      },
                      '.MuiPickersCalendarHeader-label': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Card>
              <Autocomplete
                options={groupList}
                getOptionLabel={(option) => option.name}
                value={group}
                onChange={handleGroupChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Группа"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': { borderColor: theme.palette.divider },
                      },
                    }}
                  />
                )}
              />
              <Tooltip title={group ? 'Показать расписание' : 'Выберите группу'}>
                <span>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isLoading || !group}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      boxShadow: '0 2px 6px rgba(25, 75, 210, 0.2)',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        boxShadow: '0 4px 12px rgba(25, 75, 210, 0.3)',
                      },
                      '&:disabled': {
                        bgcolor: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled,
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    ) : (
                      'Показать расписание'
                    )}
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Box>
  );
};
