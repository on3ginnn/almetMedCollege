import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AppBar,
  Toolbar,
  Stack,
  CircularProgress,
  useTheme,
  Tooltip
} from '@mui/material';
import { useApplicantsStore } from '../../stores/applicantsStore';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';

export const Rating = () => {
  const { fetchRating, rating = [], isLoading } = useApplicantsStore();
  const theme = useTheme();

  const specialtyMap = {
    pharmacy: 'Фармация',
    nursing: 'Сестринское дело',
    midwifery: 'Акушерское дело',
    lab_diagnostics: 'Лабораторная диагностика',
    medical_treatment: 'Лечебное дело',
  };

  const specialties = Object.keys(specialtyMap);
  const types = ['бюджет', 'коммерция'];

  const [selectedSpec, setSelectedSpec] = useState(specialties[0]);
  const [selectedType, setSelectedType] = useState(types[0]);

  useEffect(() => {
    fetchRating(selectedSpec, selectedType);
  }, [selectedSpec, selectedType]);

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 3 },
        // bgcolor: theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.5,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="text.primary"
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            Рейтинг абитуриентов
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              color: theme.palette.primary.main,
            }}
          >
            {specialtyMap[selectedSpec]} — {selectedType === 'бюджет' ? 'Бюджет' : 'Коммерция'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
      >
        {/* Filter Panel — будет сверху на xs, справа на md+ */}
        <Box
          sx={{
            width: { xs: '100%', md: 300 },
            order: { xs: 0, md: 1 },
            mt: { xs: 0, md: 0 },
            ml: { xs: 0, md: 3 }, // отступ СЛЕВА на desktop
            mb: { xs: 3, md: 0 }, // отступ СНИЗУ на mobile
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: { xs: '0 0 0 rgba(0,0,0,0.06)', sm: '0 2px 8px rgba(0,0,0,0.06)'}
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Параметры фильтра
            </Typography>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="spec-label">Специальность</InputLabel>
                <Select
                  labelId="spec-label"
                  value={selectedSpec}
                  label="Специальность"
                  onChange={(e) => setSelectedSpec(e.target.value)}
                >
                  {specialties.map((key) => (
                    <MenuItem key={key} value={key}>
                      {specialtyMap[key]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="type-label">Тип поступления</InputLabel>
                <Select
                  labelId="type-label"
                  value={selectedType}
                  label="Тип поступления"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {types.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        </Box>

        {/* Table — будет снизу на xs, слева на md+ */}
        <Box sx={{ flex: 1, order: { xs: 1, md: 0 } }}>
          <Paper
            sx={{
              width: '100%',
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: '0 0 0 rgba(0,0,0,0.06)'
            }}
          >
            {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress color="primary" size={40} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Загрузка данных...
                </Typography>
              </Box>
            ) : rating.length === 0 ? (
              <Typography color="text.secondary">Нет данных по выбранной специальности.</Typography>
            ) : (
              <Box sx={{ overflowX: 'auto', boxShadow: { xs: '0 0 0 rgba(0,0,0,0.06)', sm: '0 2px 8px rgba(0,0,0,0.06)'} }}>
                <Table>
                  <TableHead  sx={{ display: { xs: "none", sm: "table-header-group" }, backgroundColor: theme.palette.grey[50], borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>№</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ФИО</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ср. балл</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Приоритет</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Преимущество</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rating.map((a, i) => (
                      <TableRow
                        key={a.id}
                        sx={{
                          transition: 'background 0.2s',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        {/* Desktop Layout */}
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{i + 1}</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Typography fontWeight="medium">{a.full_name}</Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          {a.average_grade?.toFixed(2) || '—'}
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          {a.priority_enrollment !== 'none' && (
                            <Tooltip title="Первоочередное зачисление">
                              <StarIcon fontSize="small" color="primary" />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          {a.preferential_enrollment !== 'none' && (
                            <Tooltip title="Преимущественное право">
                              <VerifiedIcon fontSize="small" color="success" />
                            </Tooltip>
                          )}
                        </TableCell>

                        {/* Mobile Layout */}
                        <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' }, p: 1 }} colSpan={5}>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" fontWeight="bold">
                              {i + 1}. {a.full_name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="caption" color="text.secondary">
                                Ср. балл: {a.average_grade?.toFixed(2) || '—'}
                              </Typography>
                              {a.priority_enrollment !== 'none' && (
                                <Tooltip title="Первоочередное зачисление">
                                  <StarIcon fontSize="small" color="primary" />
                                </Tooltip>
                              )}
                              {a.preferential_enrollment !== 'none' && (
                                <Tooltip title="Преимущественное право">
                                  <VerifiedIcon fontSize="small" color="success" />
                                </Tooltip>
                              )}
                            </Stack>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </Box>
            )}
          </Paper>
        </Box>
      </Stack>    
    </Box>
  );
};
