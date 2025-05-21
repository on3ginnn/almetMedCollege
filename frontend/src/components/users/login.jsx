import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  Avatar,
  Alert,
  Stack
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useUserStore();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginUser(formData);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Ошибка входа');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Вход в аккаунт
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              label="Юзернейм"
              name="username"
              variant="outlined"
              fullWidth
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
              value={formData.password}
              onChange={handleChange}
              required
            />
            {error && (
              <Alert severity="error" variant="outlined">
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 1 }}
            >
              Войти
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};
