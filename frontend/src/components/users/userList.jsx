import { useEffect, useState } from "react";
import { userStore } from "../../stores/userStore";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UserList = () => {
  const [userList, setUserList] = useState([]);
  const navigate = new useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userStore.getUserList();
      setUserList(users);
    };
    fetchUsers();
  }, []);

  const handleUserDelete = (pk) => {
    deleteNews(pk);
  }
  
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Логин</TableCell>
            <TableCell>Пароль</TableCell>
            <TableCell>Фамилия</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Отчество</TableCell>
            <TableCell>Телефон</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.father_name}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="contained" color="warning" onClick={() => navigate(`/user/edit/${user.id}`, user)}>Редактировать</Button>
                <Button variant="contained" color="error" onClick={() => handleUserDelete(user.id)}>Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
