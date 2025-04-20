import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import { login, logout, getUser, isAuthenticated } from '../services/authService';
import { User } from '../models/User';
import { useState, useEffect } from 'react';

interface AppHeaderProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onThemeToggle: () => void;
}

export const AppHeader = ({ onMenuClick, darkMode, onThemeToggle }: AppHeaderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (isAuth) {
        const userData = await getUser();
        setUser(userData);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          FeedMe
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ width: 32, height: 32 }}
          >
            <PersonIcon />
          </Avatar>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Sign Out
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Log In
            </Button>
          )}
          <IconButton color="inherit" onClick={onThemeToggle}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 