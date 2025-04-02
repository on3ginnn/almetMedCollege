import { useEffect, useState } from "react";
import { Box, TextField, Button, Stack, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { useScheduleStore } from "../../stores/scheduleStore";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export const Schedule = () => {
    const [lessons, setLessons] = useState([]);
    const { schedule, getSchedule } = useScheduleStore();
    const [calendarDate, setCalendarDate] = useState(dayjs());
    const [group, setGroup] = useState('');

    console.log(calendarDate.format());

    useEffect(() => {
        schedule ? setLessons(schedule.lessons) : [];
    }, [schedule]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await getSchedule(calendarDate.format("YYYY-MM-DD"), group); // Используем async/await
            navigate('/schedule');
          } catch (error) {
            // setError(error.message); // Отображаем ошибку
          }
    }

    return (
        <Stack direction='row' spacing={10}>
            <Box sx={{
                width: "100%"
            }}>
                <Table sx={{ minWidth: 650 }}>
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
                </Table>
            </Box>
            <Box width='350px'>
                <form onSubmit={handleSubmit}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={calendarDate}
                            onChange={(newDate) => setCalendarDate(newDate)}
                            views={['month', 'day']}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="Группа"
                        name="group"
                        variant="outlined"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Посмотреть
                    </Button>
                </form>
            </Box>
        </Stack>
    )
}