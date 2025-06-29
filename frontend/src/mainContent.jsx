import * as React from 'react';
import { useEffect, useState } from 'react';
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
import { createTheme, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LoginIcon from '@mui/icons-material/Login';
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
import { useUserStore } from './stores/userStore';
import almetMedLogo from './assets/img/almetMedLogo.png';

let NAVIGATION = [
  {
    kind: 'header',
    title: 'Арбитуриенту',
  },
  // {
  //   segment: '',
  //   title: 'Главная',
  //   icon: <DashboardIcon />,
  // },
  // {
  //   segment: 'news',
  //   title: 'Новости',
  //   icon: <NewspaperIcon />,
  // },
  // {
  //   segment: 'schedule',
  //   title: 'Расписание',
  //   icon: <EventNoteIcon />,
  // },
  {
    segment: 'applicant',
    title: 'Анкета на поступление',
    icon: <EventNoteIcon />,
  },
  {
    segment: 'applicant/rating',
    title: 'Рейтинг поступающих',
    icon: <EventNoteIcon />,
  },
];

const adminNavigation = [
  {
    kind: 'header',
    title: 'Админка',
  },
  // {
  //   segment: 'user/all',
  //   title: 'Все пользователи',
  //   icon: <GroupIcon />,
  // },
  // {
  //   segment: 'user/create',
  //   title: 'Добавить пользователя',
  //   icon: <PersonAddIcon />,
  // },
  // {
  //   segment: 'news/create',
  //   title: 'Добавить новости',
  //   icon: <PostAddIcon />,
  // },
  // {
  //   segment: 'schedule/create',
  //   title: 'Добавить расписание',
  //   icon: <EditCalendarIcon />,
  // },
  {
    segment: 'applicant/all',
    title: 'Анкеты на поступление',
    icon: <EditCalendarIcon />,
  },
];

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
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool,
};

function MainContent(props) {
  const { window } = props;
  const router = customRouter();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)'); // Detect mobile screens (xs breakpoint)
  const demoWindow = window !== undefined ? window() : undefined;
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser, getProfile, logoutUser } = useUserStore();

  const protectedNavigation = () => {
    if (currentUser && currentUser.role === 'admin') {
      return [...NAVIGATION, ...adminNavigation];
    }
    return NAVIGATION;
  };

  useEffect(() => {
    async function fetchProfile() {
      console.log('Call fetchProfile in MainContent.jsx');
      try {
        await getProfile();
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [location.pathname, getProfile]);

  useEffect(() => {
    async function getSession() {
      setSession({
        user: {
          name: `${currentUser.last_name} ${currentUser.first_name}`,
          email: `${currentUser.phone_number}`,
          image: 'https://cdn-icons-png.freepik.com/512/16737/16737347.png?ga=GA1.1.965542116.1750058216',
        },
      });
    }

    if (currentUser) {
      getSession();
    }
  }, [currentUser]);

  const authentication = React.useMemo(() => ({
    signIn: () => {
      navigate('/login');
    },
    signOut: async () => {
      setSession(null);
      await logoutUser();
    },
    signInButtonContent: 'Войти',
    signOutButtonContent: 'Выйти',
  }), [navigate, logoutUser]);

  return (
    <AppProvider
      navigation={protectedNavigation()}
      branding={{
        logo: <img src={almetMedLogo} alt="AMK Logo" />,
        title: isMobile ? 'AMK' : 'Альметьевский медицинский колледж',
        homeUrl: '/',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={authentication}
      session={session}
      localeText={{ accountSignInLabel: 'Войти', accountSignOutLabel: 'Выйти' }}
    >
      <DashboardLayout
        sx={{
          py: '30px',
          px: '15px',
        }}
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

MainContent.propTypes = {
  window: PropTypes.func,
};

export default MainContent;