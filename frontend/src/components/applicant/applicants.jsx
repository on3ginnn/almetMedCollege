
import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Checkbox,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { useApplicantsStore } from '../../stores/applicantsStore';
import { Link, useNavigate } from 'react-router-dom';

export const Applicants = () => {
  const {
    applicants,
    getApplicants,
    enrollApplicant,
    downloadDocx,
    updateDocumentsDelivered,
    downloadExcel,
  } = useApplicantsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    getApplicants();
  }, [getApplicants]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEnroll = async (id) => {
    try {
      await enrollApplicant(id);
      await getApplicants();
    } catch (e) {
      alert('Ошибка при зачислении');
    }
  };

  const handleDocumentsDeliveredChange = async (id, checked) => {
    try {
      await updateDocumentsDelivered(id, checked);
      await getApplicants();
    } catch (e) {
      alert('Ошибка при обновлении статуса документов');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      await downloadExcel();
    } catch (e) {
      alert('Ошибка при скачивании таблицы');
    }
  };

  const filtered = applicants.filter((app) =>
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const baseColumns = [
    {
      field: 'rowNumber',
      headerName: '№',
      minWidth: 50,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: 'full_name',
      headerName: 'ФИО',
      minWidth: isMobile ? 120 : 150,
      flex: isMobile ? 1 : 1,
    },
    {
      field: 'average_grade',
      headerName: 'Средний балл',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.8,
      type: 'number',
      sortable: true,
    },
    {
      field: 'documents_delivered',
      headerName: 'Сдал документы',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.8,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.documents_delivered}
          onChange={(e) => handleDocumentsDeliveredChange(params.row.id, e.target.checked)}
          sx={{
            transform: { xs: 'scale(1.2)', sm: 'scale(1)' },
            p: { xs: 1, sm: 0.5 },
          }}
        />
      ),
    },
    {
      field: 'enroll',
      headerName: 'Зачислить',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.8,
      renderCell: (params) => (
        params.row.documents_delivered && (
          <Button
            variant="contained"
            size="small"
            disabled={params.row.enrolled}
            onClick={() => handleEnroll(params.row.id)}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 1, sm: 0.25 },
              px: { xs: 1.5, sm: 1 },
              minHeight: { xs: 36, sm: 'auto' },
              borderRadius: 2,
            }}
          >
            {params.row.enrolled ? 'Зачислен' : 'Зачислить'}
          </Button>
        )
      ),
    },
    {
      field: 'download',
      headerName: 'Скачать',
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 1 : 0.8,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => downloadDocx(params.row.id, params.row.full_name)}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            py: { xs: 1, sm: 0.25 },
            px: { xs: 1.5, sm: 1 },
            minHeight: { xs: 36, sm: 'auto' },
            borderRadius: 2,
          }}
        >
          Скачать
        </Button>
      ),
    },
  ];

  const detailsColumn = {
    field: 'details',
    headerName: 'Подробности',
    minWidth: isMobile ? 100 : 120,
    flex: isMobile ? 1 : 0.8,
    renderCell: (params) => (
      <Button
        component={Link}
        to={`/applicant/${params.row.id}`}
        variant="contained"
        color="primary"
        size="small"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          py: { xs: 1, sm: 0.25 },
          px: { xs: 1.5, sm: 1 },
          minHeight: { xs: 36, sm: 'auto' },
          borderRadius: 2,
        }}
      >
        Перейти
      </Button>
    ),
  };

  const columns = isMobile
    ? [baseColumns[0], baseColumns[1], baseColumns[2]] // Row number, Full name, Details
    : [...baseColumns];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
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
          textAlign: { xs: 'center', sm: 'left' },
          mb: { xs: 2, sm: 3 },
          color: theme.palette.text.primary,
        }}
      >
        Заявки абитуриентов
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.5, sm: 2 }}
        mb={{ xs: 2, sm: 3 }}
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
            minWidth: { xs: 'auto', sm: 200 },
            fontSize: { xs: '0.85rem', sm: '0.875rem' },
            py: { xs: 1, sm: 0.75 },
            borderRadius: 2,
            minHeight: { xs: 40, sm: 'auto' },
          }}
        >
          Скачать таблицу
        </Button>
      </Stack>

      <Paper
        sx={{
          height: { xs: 450, sm: 600, md: 700 },
          width: '100%',
          borderRadius: 2,
          boxShadow: { xs: 1, sm: 2 },
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(params) => navigate(`/applicant/${params.row.id}`)}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'average_grade', sort: 'desc' }] },
          }}
          // disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          sx={{
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
              // py: { xs: 1, sm: 1.5 },
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
