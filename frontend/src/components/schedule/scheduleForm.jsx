import React, { useState } from 'react';
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
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
  const handleLessonChange = (index, field, value) => {
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, [field]: value } : lesson
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
    <Container maxWidth="md" sx={{ py: 4 }}>
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Дата расписания"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    format="DD.MM.YYYY"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
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
              </Grid>
            </Grid>

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

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Время (например, 9:00-10:30)"
                      value={lesson.time}
                      onChange={(e) =>
                        handleLessonChange(index, 'time', e.target.value)
                      }
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Предмет"
                      value={lesson.subject}
                      onChange={(e) =>
                        handleLessonChange(index, 'subject', e.target.value)
                      }
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Преподаватель"
                      value={lesson.teacher}
                      onChange={(e) =>
                        handleLessonChange(index, 'teacher', e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Аудитория"
                      value={lesson.room}
                      onChange={(e) =>
                        handleLessonChange(index, 'room', e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
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

            {/* Кнопка отправки */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Создать расписание
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};