import { useEffect, useState } from "react";
import { Box, TextField, Button, Stack, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { useScheduleStore } from "../../stores/scheduleStore";

export const Schedule = () => {
    const [data, setData] = useState({
        date: '',
        group: ''
    });
    const [lessons, setLessons] = useState([]);
    const { schedule, getSchedule } = useScheduleStore();
    
    useEffect(() => {
        schedule ? setLessons(schedule.lessons) : [];
    }, [schedule]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData({
            ...data,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await getSchedule(data); // Используем async/await
            navigate('/schedule');
          } catch (error) {
            // setError(error.message); // Отображаем ошибку
          }
    }

    return (
        <Stack>
            <Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Дата"
                        name="date"
                        variant="outlined"
                        value={data.date}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Группа"
                        name="group"
                        variant="outlined"
                        value={data.group}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Посмотреть
                    </Button>
                </form>
            </Box>
            <Box>
                {console.log(schedule)};
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
        </Stack>
    )
}