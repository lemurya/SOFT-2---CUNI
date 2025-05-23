import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2' // azul MUI
    },
    secondary: {
      main: '#9c27b0' // púrpura
    },
    background: {
      default: '#f5f5f5'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 600
    },
    body1: {
      fontSize: 16
    }
  },
});

export default theme;
