import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  CardMedia,
  Fade,
} from "@mui/material";
import { useNewsStore } from "../../stores/newsStore";
import { useNavigate } from "react-router-dom";
import { theme } from '../../theme';
import { useUserStore } from "../../stores/userStore";

// Пример: роль пользователя (замените на вашу логику получения роли)
const useUserRole = () => {
  // return "student" | "teacher" | "admin"
  return "admin";
};

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const NewsList = () => {
  const { newsList, getNewsList, deleteNews } = useNewsStore();
  const navigate = useNavigate();
  const userRole = useUserRole();
  const { currentUser } = useUserStore();

  useEffect(() => {
    getNewsList();
    // eslint-disable-next-line
  }, []);

  const handleNewsDelete = (pk) => {
    deleteNews(pk);
  };

  const canEdit = currentUser && ["admin", "teacher"].includes(currentUser.role);

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Новости
      </Typography>
      <Stack spacing={3}>
        {newsList.map((news) => (
          <Card
            key={news.id}
            variant="outlined"
            sx={{
              bgcolor: '#fff',
              borderLeft: '6px solid #1976d2',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.04)',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.1)',
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                {/* Картинка */}
                {news.image && (
                  <Box
                    component="img"
                    src={news.image}
                    alt={news.title}
                    sx={{
                      width: { xs: "100%", sm: 180 },
                      height: { xs: 120, sm: 100 },
                      objectFit: "cover",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Контент */}
                <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {news.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {news.body}
                  </Typography>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }} flexWrap="wrap">
                    <Typography variant="caption" color="text.secondary">
                      Издатель: <b>{news.publisher}</b> — {formatDate(news.created_on)}
                    </Typography>
                    {canEdit && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => navigate(`/news/edit/${news.id}`)}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleNewsDelete(news.id)}
                        >
                          Удалить
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
