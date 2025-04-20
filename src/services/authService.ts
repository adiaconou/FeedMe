import { User } from '../models/User';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { Auth0Client } from '@auth0/auth0-spa-js';

// Verify environment variables
if (!import.meta.env.VITE_AUTH0_DOMAIN) {
  throw new Error('Missing VITE_AUTH0_DOMAIN environment variable');
}
if (!import.meta.env.VITE_AUTH0_CLIENT_ID) {
  throw new Error('Missing VITE_AUTH0_CLIENT_ID environment variable');
}
if (!import.meta.env.VITE_AUTH0_AUDIENCE) {
  throw new Error('Missing VITE_AUTH0_AUDIENCE environment variable');
}

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

console.log('Auth0 Configuration:', {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  audience: AUTH0_AUDIENCE,
  currentUrl: window.location.origin
});

const auth0Config = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: AUTH0_AUDIENCE,
  },
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
};

let auth0Client: Auth0Client | null = null;

export const getAuth0Client = async () => {
  try {
    if (!auth0Client) {
      console.log('Creating new Auth0 client...');
      auth0Client = await createAuth0Client(auth0Config);
      console.log('Auth0 client created successfully');
    }
    return auth0Client;
  } catch (error) {
    console.error('Error creating Auth0 client:', error);
    throw error;
  }
};

export const login = async () => {
  try {
    const auth0 = await getAuth0Client();
    await auth0.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: AUTH0_AUDIENCE,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const client = await getAuth0Client();
    await client.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const isAuthenticated = async () => {
  try {
    const client = await getAuth0Client();
    return await client.isAuthenticated();
  } catch (error) {
    console.error('Authentication check error:', error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const client = await getAuth0Client();
    const user = await client.getUser();
    return {
      id: user?.sub || '',
      email: user?.email,
      name: user?.name,
      picture: user?.picture,
    } as User;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const handleRedirectCallback = async () => {
  try {
    const auth0 = await getAuth0Client();
    const { appState } = await auth0.handleRedirectCallback();
    return appState;
  } catch (error) {
    console.error('Redirect callback error:', error);
    // Clear any existing state from localStorage
    localStorage.removeItem('auth0:state');
    return null;
  }
}; 