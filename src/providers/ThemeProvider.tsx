import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode, useState } from 'react';
import { lightTheme, darkTheme } from '../theme';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <MUIThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        color="inherit"
        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      {children}
    </MUIThemeProvider>
  );
}; 