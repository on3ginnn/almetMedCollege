import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

export const UserForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { getUser, updateUser, createUser } = useUserStore();

  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    father_name: '',
    phone_number: '',
    role: ''
  });

  useEffect(() => {
    if (params.id) {
      const fetchUser = async () => {
        const user = await getUser(params.id);
        if (user) setFormData(user);
      };
      fetchUser();
    }
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (params.id) {
        await updateUser(params.id, formData);
      } else {
        await createUser(formData);
      }
      navigate('/user/all');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
      <Typography variant="h4" fontWeight="bold" >
        {params.id ? 'Редактирование пользователя' : 'Добавление пользователя'}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }} elevation={1}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Фамилия"
              name="last_name"
              variant="outlined"
              fullWidth
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Имя"
              name="first_name"
              variant="outlined"
              fullWidth
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Отчество"
              name="father_name"
              variant="outlined"
              fullWidth
              value={formData.father_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Номер телефона"
              name="phone_number"
              variant="outlined"
              fullWidth
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
            <TextField
              label="Роль"
              name="role"
              select
              fullWidth
              value={formData.role}
              onChange={handleChange}
              required
              helperText="Выберите роль пользователя"
            >
              <MenuItem value="student">Студент</MenuItem>
              <MenuItem value="teacher">Преподаватель</MenuItem>
              <MenuItem value="admin">Администратор</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              {params.id ? 'Сохранить изменения' : 'Добавить пользователя'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
