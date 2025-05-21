import { Typography, Box, Stack } from "@mui/material";
import Slider from "react-slick";
import img1 from '../assets/img/1.png';
import img2 from '../assets/img/2.jpeg';
import img3 from '../assets/img/3.jpg';
import img4 from '../assets/img/4.jpg';
import img5 from '../assets/img/5.png';

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
    </Box>
  );
};
