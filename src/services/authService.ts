// src/services/authService.ts
import { createAuth0Client, Auth0Client } from '@auth0/auth0-spa-js';
import { User } from '../models/User';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID!;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE!;
const REDIRECT_URI = window.location.origin;

const auth0Config = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: REDIRECT_URI,
    audience: AUTH0_AUDIENCE,
    scope: 'openid profile email',
  },
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
};

let auth0Client: Auth0Client | null = null;
let isHandlingRedirect = false;

const getAuth0Client = async (): Promise<Auth0Client> => {
  if (!auth0Client) {
    auth0Client = await createAuth0Client(auth0Config);
    
    // Handle redirect callback immediately after client creation
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('code') && searchParams.has('state') && !isHandlingRedirect) {
      isHandlingRedirect = true;
      try {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Initial redirect handling failed:', error);
      } finally {
        isHandlingRedirect = false;
      }
    }
  }
  return auth0Client;
};

export const login = async () => {
  const auth0 = await getAuth0Client();
  await auth0.loginWithRedirect();
};

export const logout = async () => {
  const auth0 = await getAuth0Client();
  await auth0.logout({
    logoutParams: {
      returnTo: REDIRECT_URI,
    },
  });
};

export const isAuthenticated = async (): Promise<boolean> => {
  const auth0 = await getAuth0Client();
  return await auth0.isAuthenticated();
};

export const getUser = async (): Promise<User | null> => {
  const auth0 = await getAuth0Client();
  const auth0User = await auth0.getUser();
  if (!auth0User) return null;
  
  return {
    id: auth0User.sub || '',
    email: auth0User.email || '',
    name: auth0User.name || '',
    picture: auth0User.picture
  };
};

export const handleRedirectCallback = async (): Promise<boolean> => {
  // Redirect is already handled in getAuth0Client
  return true;
};
