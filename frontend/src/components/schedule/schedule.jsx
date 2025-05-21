import { useEffect, useState } from "react";
import { Box, TextField, Button, Stack, Table, TableHead, TableBody, TableRow, TableCell, Autocomplete, Typography, Paper, Card, CardContent, Grid } from "@mui/material";
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { useScheduleStore } from "../../stores/scheduleStore";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import "dayjs/locale/ru";
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventBusyIcon from '@mui/icons-material/EventBusy';

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
    
    const [lessons, setLessons] = useState([]);
    const [group, setGroup] = useState(null);
    const [calendarDate, setCalendarDate] = useState(dayjs());
    const [groupList, setGroupList] = useState([]);

    const [subgroups, setSubgroups] = useState([
      { title: "Общая", code_name: "all" },
      { title: "1п/г", code_name: "first_subgroup" },
      { title: "2п/г", code_name: "second_subgroup" },
      { title: "1 бригада", code_name: "first_brigade" },
      { title: "2 бригада", code_name: "second_brigade" },
      { title: "3 бригада", code_name: "third_brigade" },
    ]);
    const [lessonNumbers, setlessonNumbers] = useState([
      { title:"1 - 08:00-09:30", code_name:"n1" },
      { title:"2 - 09:40-11:10", code_name:"n2" },
      { title:"3 - 11:40-13:10", code_name:"n3" },
      { title:"4 - 13:20-14:50", code_name:"n4" },
      { title:"5 - 15:00-16:30", code_name:"n5" },
      { title:"6 - 16:40-18:10", code_name:"n6" },
      { title:"7 - 18:20-19:50", code_name:"n7" }
    ]);
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
    }, []);

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
      <Stack direction='row' spacing={10}>
        <Paper sx={{ width: "100%" }} elevation={0}>
          <Box sx={{ p: 3 }}>

            <Paper sx={{ width: "100%", mb: 3, bgcolor: '#f5f5f5' }} elevation={0}>
              <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                <Stack direction='row' spacing={4} alignItems="center">
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Расписание
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <GroupIcon color="primary" />
                    <Typography variant="h6" noWrap fontWeight="">
                      {currentGroup ? currentGroup.name : 'Группа не выбрана'}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="h6" fontWeight="" noWrap>
                    {currentDate ? currentDate.format('DD.MM.YYYY') : 'Дата не выбрана'}
                  </Typography>
                </Stack>
              </Box>
            </Paper>
            <Stack spacing={2}>
              {lessons.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: '#f9f9f9',
                    border: '1px dashed #bdbdbd',
                    mt: 4,
                  }}
                >
                  <EventBusyIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Нет расписания
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Для выбранной группы и даты расписание отсутствует.
                  </Typography>
                </Paper>
              ) : (lessons.map((lesson, index) => (
                <Card
                  key={lesson.id || index}
                  variant="outlined"
                  sx={{
                    bgcolor: '#fff',
                    borderLeft: '6px solid #1976d2',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.04)',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)' },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      {/* Номер пары и время */}
<Box sx={{ minWidth: 80, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          {lesson.number.replace(/\D/g, '')}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {lesson.number ? (
            <>
              <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ mt: 1 }}>
                {getLessonTitle(lesson.number).split(' - ')[1]}
              </Typography>
            </>
          ) : null}
        </Typography>
      </Box>
{/* <Box sx={{ minWidth: 80, textAlign: 'center' }}>
  <Box
    sx={{
      bgcolor: 'primary.main',
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
      px: 1.5,
      py: 0.5,
      borderRadius: 1,
      display: 'inline-block',
      mb: 0.5,
    }}
  >
    {lesson.number.replace(/\D/g, '')}
  </Box>
  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
    {getLessonTitle(lesson.number).split(' - ')[1]}
  </Typography>
</Box> */}

                      {/* Основная информация */}
                      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {lesson.major}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {lesson.teacher}
                        </Typography>
                      </Box>

                      {/* Кабинет и подгруппа */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ minWidth: 80, textAlign: 'right' }}>
                          <Typography variant="body2" color="text.secondary">
                            Кабинет
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {lesson.classroom}
                          </Typography>
                        </Box>
                        {lesson.subgroup && (
                          <Box sx={{ minWidth: 80, textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                              Подгруппа
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {getSubgroupTitle(lesson.subgroup)}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              )))}
            </Stack>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
          Параметры расписания
          </Typography>
          <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
              <DateCalendar
                  label="Дата"
                  onChange={handleDateChange}
                  views={['month', 'day']}
                  value={calendarDate}
                  // format="DD.MM.YYYY"
                  // slotProps={{ textField: { fullWidth: true } }}
              />
              </LocalizationProvider>

              <Autocomplete
              options={groupList}
              getOptionLabel={(option) => option.name}
              value={group}
              onChange={handleGroupChange}
              renderInput={(params) => (
                  <TextField {...params} label="Группа" fullWidth />
              )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading || !group}
              // startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Загрузка...' : 'Показать расписание'}
              </Button>

              {/* {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
              </Alert>
              )} */}
          </Stack>
          </form>
        </Paper>
      </Stack>
    )
}