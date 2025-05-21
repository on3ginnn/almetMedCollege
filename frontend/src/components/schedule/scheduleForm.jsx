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
import { useNavigate } from "react-router-dom";

export const ScheduleForm = () => {
  const navigate = useNavigate();
  // занятые преподы и кабинеты
  const [busyTeachers, setBusyTeachers] = useState([]);
  const [busyClassrooms, setBusyClassrooms] = useState([]);

  console.log('-----');
  console.log(busyTeachers)
  console.log(busyClassrooms)

  const [date, setDate] = useState(dayjs());
  const [selectedGroup, setSelectedGroup] = useState('');
  const [lessons, setLessons] = useState([
    { number: 'n1', subgroup: 'all', major: null, teacher: null, classroom: null },
  ]);
  // const [groupList, setGroupList] = useState(['Группа 1', 'Группа 2', 'Группа 3']); // Пример списка групп

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lessonNumbers, setlessonNumbers] = useState([
    { title:"1 - 08:00-09:30", code_name:"n1" },
    { title:"2 - 09:40-11:10", code_name:"n2" },
    { title:"3 - 11:40-13:10", code_name:"n3" },
    { title:"4 - 13:20-14:50", code_name:"n4" },
    { title:"5 - 15:00-16:30", code_name:"n5" },
    { title:"6 - 16:40-18:10", code_name:"n6" },
    { title:"7 - 18:20-19:50", code_name:"n7" }
  ]);
  const [subgroups, setSubgroups] = useState([
    { title: "Общая", code_name: "all" },
    { title: "1п/г", code_name: "first_subgroup" },
    { title: "2п/г", code_name: "second_subgroup" },
    { title: "1 бригада", code_name: "first_brigade" },
    { title: "2 бригада", code_name: "second_brigade" },
    { title: "3 бригада", code_name: "third_brigade" },
  ]);
  // const [classRooms, setClassRooms] = useState()
  const { 
    getClassroomList,
    getGroupList,
    classRooms,
    groups,
    teachers,
    getTeacherList,
    majors,
    getMajorList,
    createSchedule,
    getBusyTeachers,
    getBusyClassrooms
  } = useScheduleStore();


  useEffect(() => {
    const fetchBusyTeachers = async () => {
      const response = await getBusyTeachers(date.format('YYYY-MM-DD'));
      setBusyTeachers(response.data);
    };
    fetchBusyTeachers();
  }, [date]);

  useEffect(() => {
    const fetchBusyClassrooms = async () => {
      const response = await getBusyClassrooms(date.format('YYYY-MM-DD')); // Предполагается, что у вас есть функция getBusyClassrooms в store
      setBusyClassrooms(response.data);
    };
    fetchBusyClassrooms();
  }, [date]);

  useEffect(() => {
    const fetchClassRooms = async () => {
      await getClassroomList();
      await getGroupList();
      await getTeacherList();
      await getMajorList();
      // console.log(response);
      // setClassRooms(response);
    }
    fetchClassRooms();
  }, []);
  // useEffect(() => {
  //   const currentGroupLessons = lessons.reduce((acc, lesson) => {
  //     if (lesson.teacher) {
  //       acc.push({ lessonNumber: lesson.number, teacherId: lesson.teacher.id });
  //     }
  //     return acc;
  //   }, []);
  //   setBusyTeachers(prev => [...prev, ...currentGroupLessons]);
  // }, [lessons]);
  const isTeacherBusy = (number, teacherId) => {
    return (
      busyTeachers.some(b => b.lessonNumber === number && b.teacherId === teacherId) ||
      lessons.some((l, i) => l.number === number && l.teacher?.id === teacherId)
    );
  };
  console.log(teachers);
  console.log('ffffff')
  console.log(majors);
  // Добавить новое поле урока
  const addLesson = () => {
    // Находим максимальный номер урока
    const maxNumber = lessons.reduce((max, lesson) => {
      const lessonNumber = parseInt(lesson.number.slice(1)); // Извлекаем число из строки "n1", "n2" и т.д.
      return lessonNumber > max ? lessonNumber : max;
    }, 0);

    // Формируем новый номер урока
    const newLessonNumber = `n${maxNumber + 1}`;

    // Создаем новый урок с номером по умолчанию
    setLessons([...lessons, { number: newLessonNumber, subgroup: "all", major: null, teacher: null, classroom: null }]);
  };

  // Удалить урок
  const removeLesson = (number, subgroup) => {
    const updatedLessons = lessons.filter((item) => !(item.number === number && item.subgroup === subgroup));
    setLessons(updatedLessons);
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
    console.log(lessons);

  };

  // Отправить форму
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('lessons', lessons);
    if (!selectedGroup) {
      setError('Выберите группу');
      return;
    }
    if (lessons.some((lesson) => !lesson.number || !lesson.subgroup || !lesson.major || !lesson.teacher || !lesson.classroom)) {
      setError('Заполните все обязательные поля уроков');
      return;
    }

    // Здесь отправка данных на сервер (пример)
    const scheduleData = {
      date: date.format('YYYY-MM-DD'),
      group: selectedGroup,
      lessons: lessons.map(lesson => ({
        number: lesson.number,
        subgroup: lesson.subgroup,
        major: lesson.major.id,       // строка
        teacher: lesson.teacher.id, // строка
        classroom: lesson.classroom.id // строка
      })),
    };
    createSchedule(scheduleData);
    console.log('Отправка данных:', scheduleData);
    // setSuccess('Расписание успешно создано!');
    navigate('/schedule');
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Создание расписания
      </Typography>
      <Paper sx={{ p: 3 }} elevation={3}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DatePicker
                  label="Дата"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel>Группа</InputLabel>
                <Select
                  value={selectedGroup}
                  label="Группа"
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  {groups.map(group => (
                    <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Divider />
            <Typography variant="h6">Список уроков</Typography>
            {lessons.map((lesson, index) => (
              <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                  label="Пара"
                  select
                  value={lesson.number}
                  onChange={(e) => handleLessonChange(index, e.target)}
                  sx={{ flex: 2 }}
                  fullWidth
                  name="number"

                >
                  {lessonNumbers.map((item, index) => (<MenuItem key={index} value={item.code_name}>{item.title}</MenuItem>))}
                </TextField>
                <TextField
                  label="Подгруппа"
                  select
                  value={lesson.subgroup}
                  onChange={(e) => handleLessonChange(index, e.target)}
                  fullWidth
                  sx={{ flex: 2 }}
                  name='subgroup'

                >
                  {subgroups.map(item => (<MenuItem value={item.code_name}>{item.title}</MenuItem>))}
                </TextField>
                <Autocomplete
                  options={majors}
                  getOptionLabel={(option) => option.title || ''}
                  value={lesson.major}
                    onChange={(event, newValue) => handleLessonChange(index, {name: "major", value: newValue})}
                  renderInput={(params) => <TextField {...params} label="Предмет" fullWidth />}
                  sx={{ flex: 5 }}
 
                />
                {console.log('lessons:')}
                {console.log(lessons)}
                {console.log(busyTeachers)}
                <Autocomplete
                  options={teachers.filter(teacher => !isTeacherBusy(lesson.number, teacher.id))}

                  getOptionLabel={(option) => option.get_full_name}
                  value={lesson.teacher}
                  onChange={(event, newValue) => handleLessonChange(index, {name: "teacher", value: newValue})}
                  renderInput={(params) => (
                      <TextField {...params} label="Преподаватель" fullWidth />
                  )}
                  sx={{ flex: 4 }}

                />
                <Autocomplete
                  options={
                    classRooms.filter(classroom => 
                      !busyClassrooms.some(b => (
                        b.lessonNumber === lesson.number &&
                        b.classroomId === classroom.id
                      ) && 
                      !lessons.some((l, i) => (
                        i !== index &&
                        l.number === lesson.number &&
                        // l.subgroup === lesson.subgroup &&
                        l.classroom?.id === classroom.id
                      ))
                    )
                  )}
                  getOptionLabel={(option) => option.label || ''}
                  value={lesson.classroom}
                  onChange={(event, newValue) => handleLessonChange(index, {name: "classroom", value: newValue})}
                  renderInput={(params) => <TextField {...params} label="Кабинет" fullWidth />}
                  sx={{ flex: 2 }}

                />
                <Button color="error" onClick={() => removeLesson(lesson.number, lesson.subgroup)}>
                  <DeleteOutlineIcon />
                </Button>
              </Stack>
            ))}

            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addLesson}
              variant="outlined"
            >
              Добавить урок
            </Button>

            <Divider />
            <Button type="submit" variant="contained" size="large">
              Создать расписание
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
