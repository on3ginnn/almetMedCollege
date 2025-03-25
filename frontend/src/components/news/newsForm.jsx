import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNewsStore } from "../../stores/newsStore";

export const NewsForm = () => {
    const navigate = useNavigate();
    const { newsList, createNews } = useNewsStore();
    const [data, setData] = useState({
        title: '',
        body: '',
        publisher: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setData({
        ...data,
        [name]: value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createNews(data); // Используем async/await
        navigate('/news'); // Перенаправляем после успешной авторизации
      } catch (error) {
        setError(error.message); // Отображаем ошибку
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Добавление новости
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Заголовок"
            name="title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={data.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Текст"
            name="body"
            variant="outlined"
            fullWidth
            margin="normal"
            value={data.body}
            onChange={handleChange}
            required
          />
          <TextField
            label="Автор"
            name="author"
            variant="outlined"
            fullWidth
            margin="normal"
            value={data.author}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Добавить
          </Button>
        </form>
      </Container>
    );
}