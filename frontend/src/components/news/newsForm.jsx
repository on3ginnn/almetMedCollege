import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNewsStore } from "../../stores/newsStore";

export const NewsForm = () => {
    const navigate = useNavigate();
    const params = useParams(); // Получаем id новости из параметров маршрута
    const { newsList, createNews, updateNews } = useNewsStore(); // Добавляем функцию для обновления новости
    const [data, setData] = useState({
        title: '',
        body: '',
        publisher: ''
    });
    const [newsChanged, setNewsChanged] = useState(false);

    useEffect(() => {
        if (params.id) {
            // Если передан id новости, ищем ее в списке новостей
            const news = newsList.find(item => item.id === parseInt(params.id));
            if (news) {
                setData(news); // Обновляем состояние с данными новости
            }
        }
    }, [newsList, params.id]);

    const handleChange = (e) => {
      !newsChanged ? setNewsChanged(true) : false;
      const { name, value } = e.target;
      setData({
          ...data,
          [name]: value,
      });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (params.id) {
              if (newsChanged) await updateNews(data); // Обновляем новость, если только она поменялась
            } else {
                await createNews(data); // Создаем новую новость
            }
            navigate('/news'); // Перенаправляем после успешной операции
        } catch (error) {
            console.error(error.message); // Отображаем ошибку
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {params.id ? 'Редактирование новости' : 'Добавление новости'}
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
                    label="Издатель"
                    name="publisher"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={data.publisher}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {params.id ? 'Сохранить' : 'Добавить'}
                </Button>
            </form>
        </Container>
    );
};
