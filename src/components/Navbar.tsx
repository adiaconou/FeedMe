import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Avatar,
  Typography,
  Button,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavbarProps {
  open: boolean;
  onClose: () => void;
}

export const Navbar = ({ open, onClose }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleProfileClick = () => {
    // Navigate to profile page
    console.log('Navigate to profile');
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px',
          position: 'fixed',
          zIndex: 1200,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <IconButton onClick={handleProfileClick} sx={{ mb: 1 }}>
              <Avatar
                sx={{ width: 64, height: 64 }}
                alt="User Profile"
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              John Doe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              john.doe@example.com
            </Typography>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ width: '100%' }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Avatar sx={{ width: 64, height: 64, mb: 2 }}>
              <PersonIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{ width: '100%' }}
            >
              Sign In
            </Button>
          </>
        )}
      </Box>
      <Divider />
      <List>
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Shopping Lists" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}; 