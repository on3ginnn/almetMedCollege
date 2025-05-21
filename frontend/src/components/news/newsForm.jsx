import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useNewsStore } from "../../stores/newsStore";

export const NewsForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { newsList, createNews, updateNews } = useNewsStore();
  const [newsChanged, setNewsChanged] = useState(false);
  const [data, setData] = useState({
    title: "",
    body: "",
    publisher: ""
  });

  useEffect(() => {
    if (params.id) {
      const news = newsList.find(item => item.id === parseInt(params.id));
      if (news) setData(news);
    }
  }, [newsList, params.id]);

  const handleChange = (e) => {
    !newsChanged && setNewsChanged(true);
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (params.id) {
        if (newsChanged) await updateNews(data);
      } else {
        await createNews(data);
      }
      navigate("/news");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
      <Typography variant="h4" fontWeight="bold">
        {params.id ? "Редактирование новости" : "Добавление новости"}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Заголовок"
              name="title"
              variant="outlined"
              fullWidth
              value={data.title}
              onChange={handleChange}
              required
            />
            <TextField
              label="Текст новости"
              name="body"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={data.body}
              onChange={handleChange}
              required
            />
            <TextField
              label="Издатель"
              name="publisher"
              variant="outlined"
              fullWidth
              value={data.publisher}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              {params.id ? "Сохранить изменения" : "Добавить новость"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
