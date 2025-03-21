import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { userStore } from '../../stores/userStore';
import { useNavigate } from "react-router-dom";


export const UserCreateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    father_name: '', 
    phone_number: '', 
    role: ''
  });

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
      await userStore.createUser(formData); // Используем async/await
      navigate('/'); // Перенаправляем после успешной авторизации
    } catch (error) {
      setError(error.message); // Отображаем ошибку
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
          label="Роль"
          name="role"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.role}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Добавить
        </Button>
      </form>
    </Container>
  );
};
