import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { useApplicantsStore } from '../../stores/applicantsStore';
import { Link } from 'react-router-dom';

export const Applicants = () => {
  const {
    applicants,
    getApplicants,
    enrollApplicant,
    downloadDocx,
    downloadTitul,
    updateDocumentsStatus,
    updateDocumentsSubmitted,
    updateAdmissionType,
    downloadExcel,
    updateDocumentsCanceled,
    updateGosuslugi,
    downloadExcelDocumentCanceled,
    downloadRating,
  } = useApplicantsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 15,
  });

  const handlePaginationChange = (newModel) => {
    setPagination(newModel);
  };

  useEffect(() => {
    getApplicants();
  }, [getApplicants]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEnroll = async (id) => {
    try {
      await enrollApplicant(id);
    } catch (e) {
      alert('Ошибка при зачислении');
    }
  };

  const handleDocumentsStatusChange = async (id, checked) => {
    try {
      await updateDocumentsStatus(id, checked);
      getApplicants();
    } catch (e) {
      alert('Ошибка при обновлении статуса документов');
    }
  };

  const handleDocumentsSubmittedChange = async (id, value) => {
    try {
      await updateDocumentsSubmitted(id, value || null);
      getApplicants();
    } catch (e) {
      alert('Ошибка при обновлении типа документов');
    }
  };

  const handleDocumentsCanceledChange = async (id, checked) => {
    try {
      await updateDocumentsCanceled(id, checked);
      getApplicants();
    } catch (e) {
      alert('Ошибка при обновлении статуса забранных документов');
    }
  };

  const handleGosuslugiChange = async (id, checked) => {
    try {
      await updateGosuslugi(id, checked);
      getApplicants();
    } catch (e) {
      alert('Ошибка при обновлении статуса через госуслуги');
    }
  };

  const handleAdmissionTypeChange = async (id, value) => {
    try {
      await updateAdmissionType(id, value || null);
      getApplicants();
    } catch (e) {
      alert('Ошибка при обновлении типа поступления');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      await downloadExcel();
    } catch (e) {
      alert('Ошибка при скачивании таблицы');
    }
  };
  const handleDownloadExcelDocumentCanceled = async () => {
    try {
      await downloadExcelDocumentCanceled();
    } catch (e) {
      alert('Ошибка при скачивании таблицы "Забрали документы"');
    }
  };
  const handleDownloadExcelRating = async (specialty, selectedType) => {
    try {
      downloadRating(specialty, selectedType);
    } catch (e) {
      alert('Ошибка при скачивании таблицы рейтинга');
    }
  };

  const filtered = applicants.filter((app) =>
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const commonButtonStyles = {
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    py: { xs: 1, sm: 0.25 },
    px: { xs: 1.5, sm: 1 },
    minHeight: { xs: 36, sm: 'auto' },
    borderRadius: 2,
    textTransform: 'none',
    '&:hover': {
      bgcolor: { xs: theme.palette.primary.dark, sm: theme.palette.primary.dark },
    },
  };

  const commonIconButtonStyles = {
    p: { xs: 1, sm: 1 },
    minHeight: { xs: 32, sm: 'auto' },
    borderRadius: 2,
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
    },
    '& .MuiSvgIcon-root': {
      fontSize: { xs: '1rem', sm: '1.25rem' },
    },
  };

  const baseColumns = [
    {
      field: 'rowNumber',
      headerName: '№',
      minWidth: 50,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        const indexInPage = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return indexInPage !== -1 ? pagination.page * pagination.pageSize + indexInPage + 1 : '-';
      },
    },
    {
      field: 'full_name',
      headerName: 'ФИО',
      minWidth: isMobile ? 120 : 150,
      flex: isMobile ? 1.5 : 1.3,
    },
    {
      field: 'documents_delivered',
      headerName: 'Сдал док.',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.6,
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.documents_delivered}
          onChange={(e) => handleDocumentsStatusChange(params.row.id, e.target.checked)}
          sx={{
            transform: { xs: 'scale(1.2)', sm: 'scale(1)' },
            p: { xs: 1, sm: 0.5 },
          }}
        />
      ),
    },
    {
      field: 'documents_canceled',
      headerName: 'Забрал док.',
      minWidth: isMobile ? 100 : 80,
      flex: isMobile ? 1 : 0.6,
      sortable: false,
      renderCell: (params) => (
        // params.row.documents_delivered ? (
        <Checkbox
          checked={params.row.documents_canceled}
          onChange={(e) => handleDocumentsCanceledChange(params.row.id, e.target.checked)}
          // disabled={!params.row.documents_delivered}
          sx={{
            transform: { xs: 'scale(1.2)', sm: 'scale(1)' },
            p: { xs: 1, sm: 0.5 },
          }}
        />
        // ) : null
      ),
    },
    {
      field: 'gosuslugi',
      headerName: 'Через госуслуги',
      minWidth: isMobile ? 100 : 80,
      flex: isMobile ? 1 : 0.6,
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.gosuslugi}
          onChange={(e) => handleGosuslugiChange(params.row.id, e.target.checked)}
          sx={{
            transform: { xs: 'scale(1.2)', sm: 'scale(1)' },
            p: { xs: 1, sm: 0.5 },
          }}
        />
      ),
    },
    {
      field: 'documents_submitted',
      headerName: 'Тип док.',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.7,
      sortable: false,
      renderCell: (params) =>
        // params.row.documents_delivered ? (
          <Select
            value={params.row.documents_submitted || ''}
            onChange={(e) => handleDocumentsSubmittedChange(params.row.id, e.target.value)}
            // disabled={!params.row.documents_delivered}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              minHeight: { xs: 36, sm: 'auto' },
              maxWidth: 120,
              borderRadius: 2,
              '& .MuiSelect-select': {
                py: { xs: 1, sm: 0.5 },
                px: { xs: 1, sm: 0.5 },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.grey[400],
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.grey[300],
              },
            }}
          >
            <MenuItem value="none">Не указано</MenuItem>
            <MenuItem value="оригинал">Оригинал</MenuItem>
            <MenuItem value="копия">Копия</MenuItem>
          </Select>
        // ) : null,
    },
    {
      field: 'admission_type',
      headerName: 'Бюджет/Коммерция',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.7,
      sortable: false,
      renderCell: (params) => (
        <Select
          value={params.row.admission_type || ''}
          onChange={(e) => handleAdmissionTypeChange(params.row.id, e.target.value)}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minHeight: { xs: 36, sm: 'auto' },
            maxWidth: 120,
            borderRadius: 2,
            '& .MuiSelect-select': {
              py: { xs: 1, sm: 0.5 },
              px: { xs: 1, sm: 0.5 },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.grey[400],
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          { (params.row.specialty === 'nursing_zaochno' || params.row.specialty === 'pharmacy') ? null : <MenuItem value="бюджет">Бюджет</MenuItem> }
          <MenuItem value="коммерция">Коммерция</MenuItem>
        </Select>
      ),
    },
    {
      field: 'download',
      headerName: 'Заявление',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.4,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => downloadDocx(params.row.id, params.row.full_name)}
          sx={{
            ...commonButtonStyles,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.fill,
              borderColor: theme.palette.primary.dark,
            },
          }}
        >
          Скачать
        </Button>
      ),
    },
    {
      field: 'download_titul',
      headerName: 'Титульник',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.3,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => downloadTitul(params.row.id, params.row.full_name)}
          sx={{
            ...commonButtonStyles,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.fill,
              borderColor: theme.palette.primary.dark,
            },
          }}
        >
          Скачать
        </Button>
      ),
    },
    {
      field: 'view_rating',
      headerName: 'В рейтинге',
      minWidth: 120,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          component={Link}
          to={`/applicant/rating?specialty=${params.row.specialty}&admission_type=${params.row.admission_type}&highlight=${params.row.id}`}
          // variant="contained"
          // color="secondary"
          // size="small"
          // sx={commonIconButtonStyles}
          sx={{
            ...commonButtonStyles,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.fill,
              borderColor: theme.palette.primary.dark,
            },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
    },
  ];

  const detailsColumn = {
    field: 'details',
    headerName: '',
    minWidth: isMobile ? 40 : 50,
    flex: isMobile ? 1 : 0.3,
    sortable: false,
    align: 'center',
    renderCell: (params) => (
      <IconButton
        size="small"
        component={Link}
        to={`/applicant/${params.row.id}`}
        sx={commonIconButtonStyles}
      >
        <ArrowForwardIcon />
      </IconButton>
    ),
  };

  const columns = isMobile
    ? [baseColumns[0], baseColumns[1], detailsColumn]
    : [...baseColumns, detailsColumn];

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        pt: { xs: 3, sm: 3 },
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: 'left',
          mb: { xs: 2, sm: 3 },
          color: theme.palette.text.primary,
        }}
      >
        Заявки абитуриентов
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.5, sm: 2 }}
        mb={{ xs: 1, sm: 1 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <TextField
          label="Поиск по ФИО"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
            },
            '& .MuiInputLabel-root': {
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
            },
          }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleDownloadExcel}
          sx={{
            // ...commonButtonStyles,
            minWidth: { xs: 'auto', sm: 200 },
            bgcolor: theme.palette.success.main,
            '&:hover': {
              bgcolor: theme.palette.success.dark,
            },
          }}
        >
          Сдали документы
        </Button>
      </Stack>
      <Stack gap={1} flexWrap="wrap" direction="row" justifyContent="flex-start">
        <Button
          variant="contained"
          onClick={handleDownloadExcelDocumentCanceled}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Забрали документы
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("pharmacy", "коммерция")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Фармация
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("nursing", "бюджет")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Сестринское дело (9 класс - бюджет)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("nursing", "коммерция")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Сестринское дело (9 класс - коммерция)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("nursing_zaochno", "коммерция")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Сестринское дело очно-заочно
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("midwifery", "бюджет")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Акушерское дело (9 класс - бюджет)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("midwifery", "коммерция")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Акушерское дело (9 класс - коммерция)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("lab_diagnostics", "бюджет")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Лабораторная диагностика (9 класс - бюджет)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("medical_treatment", "бюджет")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Лечебное дело (9 класс - бюджет)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("medical_treatment", "коммерция")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Лечебное дело (9 класс - коммерция)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("medical_treatment_11", "бюджет")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Лечебное дело на базе 11 класса (бюджет)
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleDownloadExcelRating("medical_treatment_11", "коммерция")}
          sx={{
            minWidth: { xs: 'auto', sm: 200 },
            minHeight: {xs: 'auto', sm: 35 },
          }}
        >
          Рейтинг: Лечебное дело на базе 11 класса (коммерция)
        </Button>
      </Stack>
      <Paper
        sx={{
          mt: { xs: 2, sm: 3 },
          height: { xs: 450, sm: 600, md: 700 },
          width: '100%',
          borderRadius: 2,
          boxShadow: { xs: 1, sm: 2 },
          overflow: 'hidden',
          bgcolor: 'background.paper',
          // m: { xs: -1, sm: 0 }
        }}
      >
        <DataGrid
          rows={filtered}
          columns={columns}
          paginationModel={pagination}
          onPaginationModelChange={handlePaginationChange}
          // rowCount={totalCount}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
            sorting: { sortModel: [{ field: 'submitted_at', sort: 'desc' }] },
          }}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          // disableColumnMenu
          sx={{
            width: "100%",
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              alignItems: 'center',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: theme.palette.grey[100],
              fontWeight: 'bold',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 2 },
              borderBottom: `2px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: theme.palette.action.hover,
            },
            '& .MuiDataGrid-footerContainer': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 },
            },
            '& .MuiDataGrid-columnHeaders': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
            },
            border: 'none',
            '--DataGrid-rowHeight': { xs: 48, sm: 52 },
          }}
        />
      </Paper>
    </Box>
  );
};