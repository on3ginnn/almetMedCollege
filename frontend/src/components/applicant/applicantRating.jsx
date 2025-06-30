import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, InputLabel, MenuItem, Select,
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  AppBar, Toolbar, Stack, CircularProgress, useTheme, Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useApplicantsStore } from '../../stores/applicantsStore';

export const Rating = () => {
  const { fetchRating, rating = [], isLoading } = useApplicantsStore();
  const theme = useTheme();

  const specialtyOptions = [
    {
      label: 'Лечебное дело (9 классов)',
      value: { specialty: 'medical_treatment', education_base: '9' }
    },
    {
      label: 'Лечебное дело (11 классов)',
      value: { specialty: 'medical_treatment', education_base: '11' }
    },
    {
      label: 'Акушерское дело (9 классов)',
      value: { specialty: 'midwifery', education_base: '9' }
    },
    {
      label: 'Сестринское дело (9 классов)',
      value: { specialty: 'nursing', education_base: '9' }
    },
    {
      label: 'Сестринское дело (11 классов) очно-заочно',
      value: { specialty: 'nursing', education_base: '11', study_form: "очно-заочная"} // очно-заочная по умолчанию на бэке
    },
    {
      label: 'Лабораторная диагностика (9 классов)',
      value: { specialty: 'lab_diagnostics', education_base: '9' }
    },
    {
      label: 'Фармация (9 классов)',
      value: { specialty: 'pharmacy', education_base: '9' }
    }
  ];

  const types = ['бюджет', 'коммерция'];
  const [selectedOption, setSelectedOption] = useState(specialtyOptions[0]);
  const [selectedType, setSelectedType] = useState('бюджет');

  useEffect(() => {
    const { specialty, education_base } = selectedOption.value;
    fetchRating(specialty, selectedType, education_base);
  }, [selectedOption, selectedType]);

  return (
    <Box sx={{ p: { xs: 0, sm: 3 }, minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" elevation={0}
        sx={{
          mb: 3, borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}>
        <Toolbar sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0.5,
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
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
            {selectedOption.label} — {selectedType === 'бюджет' ? 'Бюджет' : 'Коммерция'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'flex-start' }}>
        {/* Filter */}
        <Box sx={{ width: { xs: '100%', md: 300 }, order: { xs: 0, md: 1 }, ml: { md: 3 }, mb: { xs: 3, md: 0 } }}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Параметры фильтра</Typography>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="spec-label">Специальность</InputLabel>
                <Select
                  labelId="spec-label"
                  value={selectedOption}
                  label="Специальность"
                  onChange={(e) => setSelectedOption(e.target.value)}
                  renderValue={(opt) => opt.label}
                >
                  {specialtyOptions.map((opt) => (
                    <MenuItem key={opt.label} value={opt}>{opt.label}</MenuItem>
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

        {/* Table */}
        <Box sx={{ flex: 1, order: { xs: 1, md: 0 } }}>
          <Paper sx={{ width: '100%', borderRadius: 2 }}>
            {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress color="primary" size={40} />
                <Typography variant="h6" sx={{ mt: 2 }}>Загрузка данных...</Typography>
              </Box>
            ) : rating.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2 }}>
                Нет данных по выбранной специальности.
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group' }, backgroundColor: theme.palette.grey[50] }}>
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
                      <TableRow key={a.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                        {/* Desktop */}
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

                        {/* Mobile */}
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
