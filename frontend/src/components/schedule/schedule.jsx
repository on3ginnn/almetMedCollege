import { useEffect, useState } from "react";
import { Box, TextField, Button, Stack, Table, TableHead, TableBody, TableRow, TableCell, Autocomplete } from "@mui/material";
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { useScheduleStore } from "../../stores/scheduleStore";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import "dayjs/locale/ru";

export const Schedule = () => {
    const [lessons, setLessons] = useState([]);
    const { schedule, getSchedule, getGroupList } = useScheduleStore();
    const [calendarDate, setCalendarDate] = useState(dayjs());
    const [group, setGroup] = useState(null);
    const [groupList, setGroupList] = useState(null);
    console.log(calendarDate.format());

    useEffect(() => {
        schedule ? setLessons(schedule.lessons) : [];
    }, [schedule]);

    useEffect(() => {
        async function fetchGroups(){
            const response = await getGroupList();
            console.log(response);
            console.log(response.map(element => element.name));
            // setGroupList(
            //     response.map(element => element.name)
            // );
            setGroupList(response);
        }

        fetchGroups();
    }, []);

    const handleChange = (event, newValue) => {
        setGroup(newValue);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await getSchedule(calendarDate.format("YYYY-MM-DD"), group.id); // Используем async/await
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
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                        <DateCalendar
                            value={calendarDate}
                            onChange={(newDate) => setCalendarDate(newDate)}
                            views={['month', 'day']}
                        />
                    </LocalizationProvider>
                    {console.log(groupList)}
                    <Autocomplete getOptionLabel={(option) => option.name} freeSolo onChange={handleChange} options={groupList} renderInput={(params) => <TextField {...params} label='Группы' />} />
                    <Button type="submit" variant="contained" color="primary">
                        Посмотреть
                    </Button>
                </form>
            </Box>
        </Stack>
    )
}