import { useEffect, useState } from "react";
import { Box, TextField, Button, Stack, Table, TableHead, TableBody, TableRow, TableCell, Autocomplete, Typography, Paper, Card, CardContent, Grid } from "@mui/material";
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { useScheduleStore } from "../../stores/scheduleStore";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import "dayjs/locale/ru";

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

    const handleGroupChange = (event, newValue) => {
        setGroup(newValue);
    };

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
            {/* <Box sx={{
                width: "100%"
            }}>
                <Typography variant="h4">
                    {currentGroup !== null ? `Расписание группы ${currentGroup.name} на ${currentDate.format("DD-MM-YYYY")}` : 'Выберите число и группу'}
                </Typography>
                {schedule !== null ? 
                    (<Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>Предмет</TableCell>
                                <TableCell>Кабинет</TableCell>
                                <TableCell>Преподаватель</TableCell>
                                <TableCell>Подгруппа</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lessons.map((lesson, index) => (
                                <TableRow key={lesson.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{lesson.major}</TableCell>
                                    <TableCell>{lesson.classroom}</TableCell>
                                    <TableCell>{lesson.teacher}</TableCell>
                                    <TableCell>{lesson.subgroup}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>)
                : (currentGroup !== null ? (<Typography variant='subtitle1'>Не опубликовано</Typography>) : "")}
            </Box> */}
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

                {isLoading ? (
                    <Typography variant='body2'>Загрузка...</Typography>
                ) : lessons.length > 0 ? (
                    <Stack spacing={2}>
                    {lessons.map((lesson, index) => (<Card key={index} variant="outlined">
                        <CardContent>
                            <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Typography variant="subtitle1">
                                {lesson.number.slice(1)}
                                </Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h6" component="div">
                                {lesson.major}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                {lesson.teacher} · {lesson.classroom}
                                </Typography>
                            </Grid>
                            </Grid>
                        </CardContent>
                        </Card>
                    ))}
                    </Stack>
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                    {currentGroup
                        ? 'Нет занятий на выбранную дату'
                        : 'Выберите группу для отображения расписания'}
                    </Typography>
                )}
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