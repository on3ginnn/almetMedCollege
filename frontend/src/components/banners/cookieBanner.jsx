import React, { useState, useEffect } from 'react';
import { Paper, Slide, Typography, Button, Stack, useTheme } from '@mui/material';
import { theme as customTheme } from '../../theme';
import { Link as MuiLink } from '@mui/material';

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setVisible(false);
  };

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Paper
        elevation={10}
        sx={{
          position: 'fixed',
          bottom: "5%",
          right: "5%",
        //   left: '50%',
        //   transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: 600,
          borderRadius: 3,
          p: 3,
          zIndex: 1500,
          boxShadow: customTheme.shadows[4],
          backgroundColor: customTheme.palette.primary.dark,
          border: `1px solid ${customTheme.palette.divider}`,
        }}
      >
        <Stack spacing={2}>
            <Typography variant="body2" color="white">
                Мы используем файлы cookie, чтобы улучшить ваш опыт на сайте. Подробнее — в{' '}
                <MuiLink
                    href="https://almetmed.ru/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="always"
                    sx={{ color: 'white', fontWeight: 500, textDecoration: 'underline', }}
                >
                    политике конфиденциальности
                </MuiLink>.
            </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined"  onClick={handleDecline} sx={{ borderColor: 'white', borderRadius: 3, color:"white" }}>
              Отклонить
            </Button>
            <Button variant="contained" onClick={handleAccept} sx={{ color: customTheme.palette.primary.dark, borderColor: 'white', borderRadius: 3, backgroundColor:"white" }}>
              Принять
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Slide>
  );
};
