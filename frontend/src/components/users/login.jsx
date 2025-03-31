import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../../stores/userStore';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useUserStore();
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
      await loginUser(formData); // Используем async/await
      navigate('/'); // Перенаправляем после успешной авторизации
    } catch (error) {
      setError(error.message); // Отображаем ошибку
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Вход
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
    </Container>
  );
};
