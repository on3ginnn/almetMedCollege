import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { userStore } from './../stores/userStore';
import { useNavigate } from "react-router-dom";


export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userStore.loginUser(formData); // Используем async/await
      navigate('/'); // Перенаправляем после успешной авторизации
    } catch (error) {
      setError(error.message); // Отображаем ошибку
    }
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Новости
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Юзернейм"
          name="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Войти
        </Button>
      </form>
    </Box>
  );
};
