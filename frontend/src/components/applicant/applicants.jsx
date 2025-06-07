import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useApplicantsStore } from '../../stores/applicantsStore';

export const Applicants = () => {
  const { applicants, getApplicants, enrollApplicant, downloadDocx } = useApplicantsStore();
  const [searchQuery, setSearchQuery] = useState('');

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

  const filtered = applicants.filter((app) =>
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'full_name', headerName: 'ФИО', flex: 1 },
    { field: 'average_grade', headerName: 'Средний балл', width: 150, type: 'number', sortable: true },
    { field: 'citizenship', headerName: 'Гражданство', width: 120 },
    { field: 'student_phone', headerName: 'Телефон', width: 150 },
    {
      field: 'enroll',
      headerName: 'Зачислить',
      width: 130,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          disabled={params.row.enrolled}
          onClick={() => handleEnroll(params.row.id)}
        >
          {params.row.enrolled ? 'Зачислен' : 'Зачислить'}
        </Button>
      ),
    },
    {
      field: 'download',
      headerName: 'Скачать',
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => downloadDocx(params.row.id, params.row.full_name)}
        >
          Скачать
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Заявки абитуриентов
      </Typography>
      <Box mb={2}>
        <TextField
          label="Поиск по ФИО"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>
      <Paper style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          sortModel={[{ field: 'average_grade', sort: 'desc' }]}
          disableSelectionOnClick
        />
      </Paper>
    </Box>
  );
};