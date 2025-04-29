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


    return (
        <Stack direction='row' spacing={10}>
            <Paper sx={{ width: "100%" }} elevation={0}>
                <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Расписание
                    <Typography component="span" color="text.secondary">
                        {' '}для группы{' '}
                    </Typography>
                    {currentGroup && (
                    <Typography variant="h6" component="span">{currentGroup.name}</Typography>
                    )}
                    <Typography component="span" color="text.secondary">
                        {' '}на{' '}
                    </Typography>
                    {currentDate && (
                        <Typography variant="h6" component="span">{currentDate.format("DD-MM-YYYY")}</Typography>
                    )}
                </Typography>
                <Paper sx={{ width: "100%", mb: 3, bgcolor: '#f5f5f5' }} elevation={0}>
  <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <GroupIcon color="primary" />
      <Typography variant="h6" fontWeight="" noWrap>
        {currentGroup ? currentGroup.name : 'Группа не выбрана'}
      </Typography>
    </Stack>

    <Stack direction="row" spacing={1} alignItems="center">
      <CalendarTodayIcon color="primary" />
      <Typography variant="h6" fontWeight="bold" noWrap>
        {calendarDate ? calendarDate.format('DD.MM.YYYY') : 'Дата не выбрана'}
      </Typography>
    </Stack>
  </Box>
</Paper>
<Stack spacing={2}>
  {lessons.map((lesson, index) => (
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
          <Box sx={{ minWidth: 64, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {lesson.number.replace(/\D/g, '')}
            </Typography>
            {lesson.timeStart && lesson.timeEnd && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {lesson.timeStart}–{lesson.timeEnd}
              </Typography>
            )}
          </Box>

          {/* Основная информация */}
          <Box sx={{ flexGrow: 1, minWidth: 200 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
              {lesson.major}
            </Typography>
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
                  {lesson.subgroup}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  ))}
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