import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Container, MenuItem } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import SelectInput from '@mui/material/Select/SelectInput';
import { useUserStore } from '../../stores/userStore';


export const UserForm = () => {
  const navigate = useNavigate();
  const params = useParams(); // Получаем id новости из параметров маршрута
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    father_name: '', 
    phone_number: '', 
    role: ''
  });
  const { getUser, updateUser, createUser } = useUserStore();

  useEffect(() => {
    if (params.id) {
      const fetchUser = async () => {
        const user = await getUser(params.id);
        if (user) {
          setFormData(user); // Обновляем состояние с данными пользователя
        }
      };
      fetchUser();
    }
  }, [params.id]);

  console.log(params);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (params.id) {
        await updateUser(params.id, formData); // Обновляем пользователя
      } else {
        await createUser(formData); // Используем async/await
      }
      navigate('/user/all');
    } catch (error) {
      console.error(error.message); // Отображаем ошибку
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Добавление пользователя
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Фамилия"
          name="last_name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Имя"
          name="first_name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Отчество"
          name="father_name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.father_name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Номер телефона"
          name="phone_number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <TextField 
          label="Выберите роль"
          name="role"
          select
          fullWidth
          value={formData.role}
          onChange={handleChange}
          size='small'
          // color="warning"
          helperText="Обязательно для заполнения"
          error={formData.role == 0}
        >
          <MenuItem value="student">Студент</MenuItem>
          <MenuItem value="teacher">Преподаватель</MenuItem>
          <MenuItem value="admin">Администратор</MenuItem>
        </TextField>
        {/* <TextField
          label="Роль"
          name="role"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.role}
          onChange={handleChange}
          required
        /> */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Добавить
        </Button>
      </form>
    </Container>
  );
};
