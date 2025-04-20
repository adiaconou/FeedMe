import { Container, Typography, Box, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { CreateShoppingListModal } from './components/CreateShoppingListModal';
import { ShoppingList } from './components/ShoppingList';
import { useShoppingListViewModel } from './viewmodels/ShoppingListViewModel';
import { useState, useEffect } from 'react';
import { exampleCommands } from './constants/commands';
import { Navbar } from './components/Navbar';
import { AppHeader } from './components/AppHeader';
import { getAuth0Client, isAuthenticated, handleRedirectCallback } from './services/authService';

function App() {
  const [userInput, setUserInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const {
    open,
    inputText,
    isLoading,
    shoppingItems,
    error,
    handleClose,
    setInputText,
    handleCreateList,
  } = useShoppingListViewModel();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize Auth0 client
        await getAuth0Client();
        
        // Check if we're handling a redirect callback
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
          try {
            await handleRedirectCallback();
            // Clear the URL parameters after handling the callback
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error) {
            console.error('Error handling redirect callback:', error);
            // Clear any existing state from localStorage
            localStorage.removeItem('auth0:state');
          }
        }

        await isAuthenticated();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputText(userInput);
    handleCreateList();
  };

  if (isAuthLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppHeader 
        onMenuClick={handleDrawerToggle}
        darkMode={darkMode}
        onThemeToggle={handleThemeToggle}
      />
      <Navbar open={drawerOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          position: 'relative',
          width: '100%',
          transition: (theme) =>
            theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: { sm: drawerOpen ? 0 : 0 },
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)', // Subtract header height
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textAlign: 'center',
                mb: 2,
              }}
            >
              FeedMe AI Assistant
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mb: 4,
              }}
            >
              Tell me what you'd like to cook, and I'll help you plan it
            </Typography>

            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                width: '100%',
                borderRadius: 2,
              }}
            >
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., 'Find a recipe for chicken parmesan and create a shopping list for six people'"
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!userInput.trim() || isLoading}
                >
                  {isLoading ? 'Planning your meal...' : 'FEED ME'}
                </Button>
              </form>
            </Paper>

            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                width: '100%',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                Try these example commands:
              </Typography>
              <List dense sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 0 }}>
                {exampleCommands.map((command, index) => (
                  <ListItem 
                    key={index}
                    button
                    onClick={() => setUserInput(command)}
                    sx={{
                      borderRadius: 1,
                      p: 0.5,
                      width: 'auto',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <ListItemText 
                      primary={command}
                      sx={{ 
                        color: 'text.secondary',
                        '& .MuiTypography-root': {
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <CreateShoppingListModal
              open={open}
              onClose={handleClose}
              inputText={inputText}
              onInputChange={setInputText}
              onCreateList={handleCreateList}
              isLoading={isLoading}
              error={error}
            />

            {shoppingItems.length > 0 && (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  width: '100%',
                  borderRadius: 2,
                }}
              >
                <ShoppingList items={shoppingItems} />
              </Paper>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default App;