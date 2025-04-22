import { Container, Typography, Box, TextField, Button, Paper, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { CreateShoppingListModal } from './components/CreateShoppingListModal';
import { ShoppingList } from './components/ShoppingList';
import { useShoppingListViewModel } from './viewmodels/ShoppingListViewModel';
import { useState, useEffect } from 'react';
import { exampleCommands } from './constants/commands';
import { Navbar } from './components/Navbar';
import { AppHeader } from './components/AppHeader';
import { isAuthenticated, getUser } from './services/authService';
import { User } from './models/User';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { CssBaseline } from '@mui/material';
import { LLMService } from './services/llmService';
import { Recipe } from './models/Recipe';

function App(): JSX.Element {
  const [userInput, setUserInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const {
    open,
    inputText,
    isLoading: shoppingListLoading,
    shoppingItems,
    error,
    handleClose,
    setInputText,
    handleCreateList,
  } = useShoppingListViewModel();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        console.log('Authentication status:', isAuth);
        
        if (isAuth) {
          const userData = await getUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication init failed:', error);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await LLMService.generateRecipe(userInput);
      setRecipe(response);
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setIsLoading(false);
    }
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
        darkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        user={user}
        onUserChange={setUser}
      />
      <Navbar open={drawerOpen} onClose={handleDrawerToggle} user={user} />
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
            minHeight: 'calc(100vh - 64px)',
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
              <List dense sx={{ p: 0 }}>
                {exampleCommands.map((command, index) => (
                  <ListItem 
                    key={index}
                    disablePadding
                  >
                    <ListItemButton
                      onClick={() => setUserInput(command)}
                      sx={{
                        borderRadius: 1,
                        p: 0.5,
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <ListItemText 
                        primary={command}
                        sx={{ 
                          color: 'text.secondary',
                          '& .MuiTypography-root': {
                            fontSize: '0.875rem',
                          }
                        }}
                      />
                    </ListItemButton>
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
              isLoading={shoppingListLoading}
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

            {recipe && (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  width: '100%',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {recipe.title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Serves: {recipe.servingCount}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Ingredients:
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="h6" gutterBottom>
                  Instructions:
                </Typography>
                <List>
                  {recipe.instructions.map((instruction, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={`${index + 1}. ${instruction}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

const AppWithTheme: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

export default AppWithTheme;