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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { useApplicantsStore } from '../../stores/applicantsStore';
import { Link } from 'react-router-dom';

export const Applicants = () => {
  const { applicants, getApplicants, enrollApplicant, downloadDocx, updateDocumentsDelivered, downloadExcel } = useApplicantsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      field: 'full_name',
      headerName: 'ФИО',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'average_grade',
      headerName: 'Средний балл',
      minWidth: 120,
      flex: 0.8,
      type: 'number',
      sortable: true,
    },
    {
      field: 'student_phone',
      headerName: 'Телефон',
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: 'documents_delivered',
      headerName: 'Сдал документы',
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.documents_delivered}
          onChange={(e) => handleDocumentsDeliveredChange(params.row.id, e.target.checked)}
          sx={{ transform: { xs: 'scale(1.2)', sm: 'scale(1)' } }}
        />
      ),
    },
    {
      field: 'enroll',
      headerName: 'Зачислить',
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        params.row.documents_delivered && (
          <Button
            variant="contained"
            size="small"
            disabled={params.row.enrolled}
            onClick={() => handleEnroll(params.row.id)}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 0.25 },
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
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => downloadDocx(params.row.id, params.row.full_name)}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            py: { xs: 0.5, sm: 0.25 },
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
    minWidth: 120,
    flex: 0.8,
    renderCell: (params) => (
      <Button
        component={Link}
        to={`/applicant/${params.row.id}`}
        variant="contained"
        color="primary"
        size="small"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          py: { xs: 0.5, sm: 0.25 },
        }}
      >
        Перейти
      </Button>
    ),
  };

  const columns = isMobile ? [baseColumns[0], detailsColumn] : [...baseColumns, detailsColumn];

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.paper',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          textAlign: { xs: 'center', sm: 'left' },
          px: { xs: 1, sm: 0 },
        }}
      >
        Заявки абитуриентов
      </Typography>
      <Box
        mb={{ xs: 1, sm: 1.5, md: 2 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 },
          px: { xs: 1, sm: 0 },
        }}
      >
        <TextField
          label="Поиск по ФИО"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          size="small"
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleDownloadExcel}
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            py: { xs: 1, sm: 0.75 },
            whiteSpace: 'normal',
            textAlign: 'center',
            minWidth: { xs: '100%', sm: 200 },
            maxWidth: { xs: '100%', sm: 250 },
          }}
        >
          Скачать таблицу
        </Button>
      </Box>
      <Paper
        sx={{
          height: { xs: 500, sm: 600, md: 700 },
          width: '100%',
          overflowX: 'auto',
          boxShadow: { xs: 'none', sm: '0 2px 8px rgba(0,0,0,0.1)' },
        }}
      >
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'average_grade', sort: 'desc' }] },
          }}
          disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            width: '100%',
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' },
              whiteSpace: 'normal',
              lineHeight: '1.2',
              p: { xs: 0.5, sm: 1 },
            },
            '& .MuiDataGrid-columnHeader': {
              p: { xs: 0.5, sm: 1 },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' },
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row': {
              minHeight: { xs: 40, sm: 48, md: 52 },
            },
            '& .MuiDataGrid-footerContainer': {
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            },
          }}
        />
      </Paper>
    </Box>
  );
};