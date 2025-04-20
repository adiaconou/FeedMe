import { Button } from '@mui/material';
import { login } from '../services/authService';

export const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleLogin}
    >
      Log In
    </Button>
  );
}; 