import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: replace with actual API call to fetch applicants
    fetch('/api/applicants')
      .then((res) => res.json())
      .then((data) => setApplicants(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEnroll = (id) => {
    // TODO: replace with actual API call to enroll applicant
    fetch(`/api/applicants/${id}/enroll`, { method: 'POST' })
      .then((res) => {
        if (res.ok) {
          alert('Абитуриент зачислен');
          setApplicants((prev) => prev.map((app) => app.id === id ? { ...app, enrolled: true } : app));
        } else {
          alert('Ошибка при зачислении');
        }
      })
      .catch(() => alert('Ошибка сети'));
  };

  const filtered = applicants.filter((app) =>
    app.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fullName', headerName: 'ФИО', flex: 1 },
    { field: 'averageScore', headerName: 'Средний балл', width: 150, type: 'number', sortable: true },
    { field: 'citizenship', headerName: 'Гражданство', width: 120 },
    { field: 'phoneStudent', headerName: 'Телефон', width: 150 },
    {
      field: 'enroll',
      headerName: 'Зачислить',
      width: 120,
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
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
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
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          sortModel={[{ field: 'averageScore', sort: 'desc' }]}
          disableSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
