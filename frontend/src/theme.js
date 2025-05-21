import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#2962ff',
      dark: '#2196f3',
      light: '#5393ff',
    },
    secondary: {
      main: '#f5f5f5',
      dark: '#616161',
      light: '#fafafa',
    },
    error: {
      main: red.A400,
    },
  },
});

