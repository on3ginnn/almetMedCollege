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
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
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
import CircularProgress from '@mui/material/CircularProgress';
import { CookieBanner } from './components/banners/cookieBanner';
import { Link as MuiLink } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PrivacyTipRoundedIcon from '@mui/icons-material/PrivacyTipRounded';


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
    segment: 'privacy-redirect',
    title: 'Политика конфиденциальности',
    icon: <PrivacyTipRoundedIcon />,
  },
];

const adminNavigation = [
  {
    segment: 'applicant',
    title: 'Анкета на поступление',
    icon: <EventNoteRoundedIcon />,
  },
  {
    segment: 'applicant/rating',
    title: 'Рейтинг поступающих',
    icon: <StarRoundedIcon />,
  },
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
    icon: <EditCalendarRoundedIcon />,
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
  const { currentUser, getProfile, logoutUser, isLoading } = useUserStore();

  const protectedNavigation = () => {
    if (currentUser && currentUser.role === 'admin') {
      return [...NAVIGATION, ...adminNavigation];
    }
    return NAVIGATION;
  };

  useEffect(() => {
    // localStorage.removeItem('cookiesAccepted')
    getProfile(); // загружаем при монтировании
  }, []);

  useEffect(() => {
    if (currentUser) {
      setSession({
        user: {
          name: `${currentUser.last_name} ${currentUser.first_name}`,
          email: `${currentUser.phone_number}`,
          image: 'https://cdn-icons-png.freepik.com/512/16737/16737347.png?ga=GA1.1.965542116.1750058216',
        },
      });
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

  if (isLoading) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  } else {
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
          navigation={protectedNavigation()}
          router={router}
          sx={{
            // pb: '30px',
            // px: '15px',
          }}
        >
          <Outlet />
          <CookieBanner />
          {/* <MuiLink
            href="https://almetmed.ru/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            textAlign='center'
            sx={{ color: 'gray', fontWeight: 400}}
          >
            Политика конфиденциальности
          </MuiLink> */}
        </DashboardLayout>
      </AppProvider>
    );
  }
}

MainContent.propTypes = {
  window: PropTypes.func,
};

export default MainContent;