import { Typography, Box, Stack, Card, CardContent, Button } from "@mui/material";
import Slider from "react-slick";
import img1 from '../assets/img/1.png';
import img2 from '../assets/img/2.jpeg';
import img3 from '../assets/img/3.jpg';
import img4 from '../assets/img/4.jpg';
import img5 from '../assets/img/5.png';
import { useEffect } from "react";

const slides = [ 
  {
    title: "Специальность 31.02.01. Лечебное дело",
    image: img1,
    subtitle: "Квалификация «Фельдшер»",
  },
  {
    title: "Специальность 33.02.01. Фармация",
    image: img2,
    subtitle: "Квалификация «Фармацевт»",
  },
  {
    title: "Специальность 34.02.01. Сестринское дело ",
    image: img3,
    subtitle: "Квалификация «Медицинская сестра / медицинский брат»",
  },
  {
    title: "Специальность 31.02.03 Лабораторная диагностика",
    image: img4,
    subtitle: "Квалификация «Медицинский лабораторный техник»",
  },
  {
    title: "Специальность 31.02.02 Акушерское дело",
    image: img5,
    subtitle: "Квалификация «акушерка/акушер»",
  },
];
import { useNewsStore } from "../stores/newsStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
  });
}

export const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const { newsList, getNewsList, deleteNews } = useNewsStore();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();

  useEffect(() => {
    getNewsList();
  }, []);

  const handleNewsDelete = (pk) => {
    deleteNews(pk);
  };

  const canEdit = currentUser && ["admin", "teacher"].includes(currentUser.role);

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Добро пожаловать!
      </Typography>

      <Box sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Slider {...settings} sx={{ borderRadius: 2, overflow: "hidden" }}>
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                height: { xs: 220, sm: 300, md: 400 },
                overflow: 'hidden',
                backgroundImage: `url(${slide.image})`,
                borderRadius: 2, overflow: "hidden",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '5%',
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  maxWidth: '70%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  p: 3,
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {slide.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
                  {slide.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
      <Typography sx={{ mt: 3 }} variant="h5" gutterBottom fontWeight="bold">
        Новости
      </Typography>
      <Stack spacing={3}>
        {newsList.map((news) => (
          <Card
            key={news.id}
            variant="outlined"
            sx={{
              bgcolor: 'background.paper',
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
