import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Card, CardContent, Grid, useMediaQuery, useTheme,
} from '@mui/material';
import { useApplicantsStore } from '../../stores/applicantsStore';

const TabPanel = ({ value, index, children }) => {
  return value === index ? <Box sx={{ p: 2 }}>{children}</Box> : null;
};

export const Rating = () => {
  const { fetchRatings, ratings } = useApplicantsStore();
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const types = ['бюджет', 'коммерция'];

  const specialtyMap = {
    pharmacy: 'Фармация',
    nursing: 'Сестринское дело',
    midwifery: 'Акушерское дело',
    lab_diagnostics: 'Лабораторная диагностика',
    medical_treatment: 'Лечебное дело',
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Рейтинг абитуриентов
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(e, newVal) => setTabIndex(newVal)}
        centered={!isMobile}
        variant={isMobile ? 'scrollable' : 'standard'}
      >
        {types.map((type, idx) => (
          <Tab key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} />
        ))}
      </Tabs>

      {types.map((type, idx) => (
        <TabPanel key={type} value={tabIndex} index={idx}>
          {Object.entries(ratings[type] || {}).map(([specialtyKey, apps]) => {
            const [specialty, educationBase] = specialtyKey.split('_');
            const specialtyName = specialtyMap[specialty] || specialty;
            const displayName = specialty === 'nursing' ? `${specialtyName} (${educationBase === '9' ? '9 классов' : '11 классов'})` : specialtyName;
            return (
              <Box key={specialtyKey} sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="medium" mb={2}>
                  {displayName} ({apps.length} заявок)
                </Typography>

                {apps.length > 0 ? (
                  <Grid container spacing={2}>
                    {apps.map((a, i) => (
                      <Grid item xs={12} sm={6} md={4} key={a.id}>
                        <Card sx={{ borderRadius: 2, bgcolor: 'background.paper', boxShadow: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              #{i + 1}. {a.full_name}
                            </Typography>
                            <Typography variant="body2">Регистрационный номер: {a.registration_number || '-'}</Typography>
                            <Typography variant="body2">Телефон: {a.student_phone || '-'}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Нет данных по данной специальности
                  </Typography>
                )}
              </Box>
            );
          })}
        </TabPanel>
      ))}
    </Box>
  );
};