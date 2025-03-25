import * as React from 'react';
import axios from "axios";
import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from '@toolpad/core/Account';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { customRouter } from './config/customRouter';
import { userStore, useUserStore } from './stores/userStore';

let NAVIGATION = [
  {
    kind: 'header',
    title: 'Разделы',
  },
  {
    segment: '',
    title: 'Главная',
    icon: <DashboardIcon />,
  },
  {
    segment: 'login',
    title: 'Войти',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'news',
    title: 'Новости',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'shedule',
    title: 'Расписание',
    icon: <ShoppingCartIcon />,
  },
];

const adminNavigaion = [
  {
    segment: 'user/all',
    title: 'Все пользователи',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'user/create',
    title: 'Добавить пользователя',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'news/create',
    title: 'Добавить новости',
    icon: <ShoppingCartIcon />,
  },
  
]

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  /**
   * The handler used when the preview is expanded
   */
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  /**
   * The state of the Account popover
   * @default false
   */
  open: PropTypes.bool,
};

function MainContent(props) {
  const { window } = props;
  const router = customRouter();
  const navigate = useNavigate();
  const location = useLocation(); // Используем хук useLocation
  const { userRole } = useUserStore();
  const demoWindow = window !== undefined ? window() : undefined;
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null); // Состояние для ошибок

  const protectedNavigation = () => {
    if (userRole && userRole === "admin"){
      // NAVIGATION = [...NAVIGATION, ...adminNavigaion];
      return [...NAVIGATION, ...adminNavigaion];
    }
    return NAVIGATION;
  }

  console.log(location);
  console.log(location.pathname);
  console.log()
  // useEffect(() => {
  //   newsStore.getNewsList();
  // }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Call fetchProfile in mainContent.jsx")
      try {
        const res_data = await userStore.getProfile();
        setSession({
          user: {
            name: `${res_data.last_name} ${res_data.first_name}`,
            email: `${res_data.email}`,
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        }); // Сохраняем данные профиля в состояние
      } catch (err) {
        setError(err.message); // Сохраняем сообщение об ошибке
      }
    };

    fetchProfile(); // Вызываем функцию получения профиля
  // }, []);
  }, [location.pathname]);

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        navigate('/login');
      },
      signOut: async () => {
        setSession(null);
        const response = await userStore.logoutUser();
        console.log("success logout");
        console.log(response);
      },
    };
  }, []);
  
  return (
    <AppProvider
      navigation={protectedNavigation()}
      branding={{
        // logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'Альметьевский медицинский колледж',
        homeUrl: '/',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={authentication}
      // authentication={React.useMemo(() => navigate('/login'))}
      session={session}
    >
      <DashboardLayout
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

MainContent.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default MainContent;