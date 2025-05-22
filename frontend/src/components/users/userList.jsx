import { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from '@mui/icons-material/Group';
import { useTheme } from "@mui/material/styles";

export const UserList = () => {
  const navigate = useNavigate();
  const { userList, getUserList, deleteUser } = useUserStore();
  const theme = useTheme();

  useEffect(() => {
    getUserList();
    // eslint-disable-next-line
  }, []);

  const handleUserDelete = (pk) => {
    deleteUser(pk);
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
      {/* <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <GroupIcon color="primary" /> */}
        <Typography variant="h4" fontWeight="bold">
          Список пользователей
        </Typography>
      {/* </Stack> */}

      {userList.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            mt: 2,
            textAlign: "center",
            // bgcolor: "#f9f9f9",
            border: "1px dashed #bdbdbd",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Пользователи не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Список пользователей пуст или не удалось загрузить данные.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={1} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: (theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[900]) }}>
                <TableCell>ID</TableCell>
                <TableCell>Имя пользователя</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Отчество</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.father_name}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={() => navigate(`/user/edit/${user.id}`)}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleUserDelete(user.id)}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
