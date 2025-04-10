import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  Alert,
  Autocomplete,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useScheduleStore } from "../../stores/scheduleStore";

export const ScheduleForm = () => {
  // Состояния формы
  const [date, setDate] = useState(dayjs());
  const [selectedGroup, setSelectedGroup] = useState('');
  const [lessons, setLessons] = useState([
    { time: '', subject: '', teacher: '', classroom: '' },
  ]);
  // const [groupList, setGroupList] = useState(['Группа 1', 'Группа 2', 'Группа 3']); // Пример списка групп
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lessonNumbers, setlessonNumbers] = useState([
    {
      title:"1 - 08:00-09:30",
      code_name:"n1"
    },
    {
      title:"2 - 09:40-11:10",
      code_name:"n2"
    },
    {
      title:"3 - 11:40-13:10",
      code_name:"n3"
    },
    {
      title:"4 - 13:20-14:50",
      code_name:"n4"
    },
    {
      title:"5 - 15:00-16:30",
      code_name:"n5"
    },
    {
      title:"6 - 16:40-18:10",
      code_name:"n6"
    },
    {
      title:"7 - 18:20-19:50",
      code_name:"n7"
    }
  ]);
  const [subgroups, setSubgroups] = useState([
    {
      title: "Общая",
      code_name: "all"
    },
    {
      title: "1п/г",
      code_name: "first_subgroup"
    },
    {
      title: "2п/г",
      code_name: "second_subgroup"
    },
    {
      title: "1 бригада",
      code_name: "first_brigade"
    },
    {
      title: "2 бригада",
      code_name: "second_brigade"
    },
    {
      title: "3 бригада",
      code_name: "third_brigade"
    },
  ]);
  // const [classRooms, setClassRooms] = useState()
  const { getClassroomList, getGroupList, classRooms, groups } = useScheduleStore();

  useEffect(() => {
    const fetchClassRooms = async () => {
      await getClassroomList();
      await getGroupList();
      // console.log(response);
      // setClassRooms(response);
    }
    fetchClassRooms();
  }, []);
  console.log(classRooms);
  // Добавить новое поле урока
  const addLesson = () => {
    setLessons([...lessons, { time: '', subject: '', teacher: '', room: '' }]);
  };

  // Удалить урок
  const removeLesson = (index) => {
    if (lessons.length > 1) {
      const updatedLessons = lessons.filter((_, i) => i !== index);
      setLessons(updatedLessons);
    }
  };

  // Обновить данные урока
  const handleLessonChange = (index, target) => {
    console.log(lessons);
    console.log(index)
    const updatedLessons = lessons.map((lesson, i) => {
      if (i === index) {
        console.log("updated")
        return { ...lesson, [target.name]: target.value }
      } 
      return lesson;
    }
      // i === index ? { ...lesson, [target.name]: target.value } : lesson
    );
    setLessons(updatedLessons);
  };

  // Отправить форму
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGroup) {
      setError('Выберите группу');
      return;
    }
    if (lessons.some((lesson) => !lesson.time || !lesson.subject)) {
      setError('Заполните все обязательные поля уроков');
      return;
    }

    // Здесь отправка данных на сервер (пример)
    const scheduleData = {
      date: date.format('YYYY-MM-DD'),
      group: selectedGroup,
      lessons,
    };

    console.log('Отправка данных:', scheduleData);
    setSuccess('Расписание успешно создано!');
    setError('');
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Создание нового расписания
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Поля даты и группы */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                  <DatePicker
                    label="Дата расписания"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    format="DD.MM.YYYY"
                    views={['month', 'day']}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Группа</InputLabel>
                  <Select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    label="Группа"
                    required
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Список уроков */}
            <Typography variant="h6">Уроки</Typography>

            {lessons.map((lesson, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  position: 'relative',
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Пара"
                    value={lesson.number}
                    name="number"
                    onChange={(e) => handleLessonChange(index, e.target)}
                    fullWidth
                    required
                    sx={{ flex: 2 }}
                    select
                    defaultValue={`n${index + 1}`}
                  >
                    {lessonNumbers.map((item, index) => (<MenuItem key={index} value={item.code_name}>{item.title}</MenuItem>))}
                  </TextField>
                  <TextField
                    label="Подгруппа"
                    name='subgroup'
                    value={lesson.subgroup}
                    onChange={(e) => handleLessonChange(index, e.target)}
                    fullWidth
                    required
                    select
                    sx={{ flex: 2 }}
                    defaultValue="all"
                    >
                    {subgroups.map(item => (<MenuItem value={item.code_name}>{item.title}</MenuItem>))}
                  </TextField>

                  <TextField
                    label="Предмет"
                    value={lesson.subject}
                    onChange={(e) => handleLessonChange(index, 'subject', e.target.value)}
                    fullWidth
                    required
                    sx={{ flex: 5 }}
                  />

                  <TextField
                    label="Преподаватель"
                    value={lesson.teacher}
                    onChange={(e) => handleLessonChange(index, 'teacher', e.target.value)}
                    fullWidth
                    sx={{ flex: 3 }}
                  />
                  {console.log(classRooms)}
                  <Autocomplete
                    options={classRooms}
                    // getOptionLabel={(option) => option.title}
                    value={lesson.room}
                    onChange={(event, newValue) => handleLessonChange(index, {name: "classroom", value: newValue})}
                    renderInput={(params) => (
                        <TextField {...params} label="Кабинет" fullWidth />
                    )}
                    fullWidth
                    sx={{ flex: 2 }}
                  />
  

                <Button
                  onClick={() => removeLesson(index)}
                  sx={{  }}
                  color="error"
                  size="small"
                >
                  <DeleteOutlineIcon />
                </Button>
                </Stack>
              </Box>
            ))}

            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addLesson}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            >
              Добавить урок
            </Button>

            <Divider sx={{ my: 2 }} />
          </Stack>
        </form>

      </Paper>
    </Container>
  );
};