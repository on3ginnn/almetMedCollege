import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Slide, Typography, Button, Stack, useTheme } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

const RedirectToPrivacy = () => {
  useEffect(() => {
    window.location.href = 'https://almetmed.ru/privacy/';
  }, []);

  return (
    <Box>
        <LinearProgress />
        <Box
            sx={{
                p: { xs: 1, sm: 3 },
                pt: { xs: 3, sm: 5 },
                minHeight: '100vh',
            }}
            >
                <Typography variant='h6' sx={{ fontWeight: 500 }}>Перенаправляем на политику конфиденциальности...</Typography>
        </Box>
    </Box>
    )
};

export default RedirectToPrivacy;
