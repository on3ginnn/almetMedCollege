import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';


export const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useUserStore();
  
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    console.log(`Protected routes not allowed`);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
