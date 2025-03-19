import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from './../stores/userStore';


export const ProtectedRoute = ({ allowedRoles }) => {
  const { userRole } = useUserStore();
    console.log(userRole)
    console.log(allowedRoles)
    console.log(!userRole || !allowedRoles.includes(userRole))
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
