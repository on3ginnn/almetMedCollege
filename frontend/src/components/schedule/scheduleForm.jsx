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
    { time: '', subject: '', teacher: '', room: '' },
  ]);
  const [groups, setGroups] = useState(['Группа 1', 'Группа 2', 'Группа 3']); // Пример списка групп
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lessonNumbers, setlessonNumbers] = useState([
    {
      title:"1",
      code_name:"n1"
    },
    {
      title:"2",
      code_name:"n2"
    },
    {
      title:"3",
      code_name:"n3"
    },
    {
      title:"4",
      code_name:"n4"
    },
    {
      title:"5",
      code_name:"n5"
    },
    {
      title:"6",
      code_name:"n6"
    },
    {
      title:"7",
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
  const [classRooms, setClassRooms] = useState()
  const { getClassroomList } = useScheduleStore();

  useEffect(() => {
    const fetchClassRooms = async () => {
      const response = await getClassroomList();
      console.log(response.data);
      setClassRooms(response.data);
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
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, [target.name]: target.value } : lesson
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
    <Container fullWidth sx={{ py: 4 }}>
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Дата расписания"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    format="DD.MM.YYYY"
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
                      <MenuItem key={group} value={group}>
                        {group}
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
                <IconButton
                  onClick={() => removeLesson(index)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="error"
                >
                  <DeleteOutlineIcon />
                </IconButton>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Пара"
                    value={lesson.number}
                    name="number"
                    onChange={(e) => handleLessonChange(index, e.target.value)}
                    fullWidth
                    required
                    sx={{ flex: 1 }}
                    select
                    defaultValue={`n${index + 1}`}
                  >
                    {lessonNumbers.map((index, item) => (<MenuItem key={index} value={item.code_name}>{item.title}</MenuItem>))}
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
                    sx={{ flex: 4 }}
                  />

                  <TextField
                    label="Преподаватель"
                    value={lesson.teacher}
                    onChange={(e) => handleLessonChange(index, 'teacher', e.target.value)}
                    fullWidth
                    sx={{ flex: 3 }}
                  />

                  <Autocomplete
                    options={classRooms}
                    // getOptionLabel={(option) => option.title}
                    value={lesson.room}
                    onChange={(event, newValue) => lesson.room = newValue}
                    renderInput={(params) => (
                        <TextField {...params} label="Кабинет" fullWidth />
                    )}
                    fullWidth
                    sx={{ flex: 2 }}
                  />
  
                  <TextField
                    label="Аудитория"
                    value={lesson.room}
                    onChange={(e) => handleLessonChange(index, 'room', e.target.value)}
                    fullWidth
                    sx={{ flex: 1 }}
                  />
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