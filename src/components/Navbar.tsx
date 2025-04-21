import { useState, useEffect } from 'react';
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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { getUser, isAuthenticated } from '../services/authService';
import { User } from '../models/User';

interface NavbarProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export const Navbar = ({ open, onClose, user }: NavbarProps) => {
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
        {user && (
          <>
            <IconButton onClick={handleProfileClick} sx={{ mb: 1 }}>
              <Avatar
                sx={{ width: 64, height: 64 }}
                alt={user.name}
                src={user.picture}
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user.email}
            </Typography>
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