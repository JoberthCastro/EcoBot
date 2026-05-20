import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginRequest,
  registerRequest,
  getUserById,
  updateUserProfile,
  updateUserPreferences,
  clearAuthSession
} from '../services/userApi';

const AppContext = createContext();
const DEFAULT_USER = {
  id: null,
  name: 'Usuário EcoBot',
  email: 'usuario@ecobot.com',
  role: 'Usuário',
  avatar: '/logo.png',
  joinedDate: new Date().toLocaleDateString('pt-BR'),
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'pt-BR'
  }
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ecobot-theme') || 'light';
  });

  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem('ecobot-notifications')) ?? true;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ecobot-language') || 'pt-BR';
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('ecobot-user')) || DEFAULT_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      localStorage.getItem('ecobot-authenticated') === 'true' &&
      Boolean(localStorage.getItem('ecobot-token'))
    );
  });
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    localStorage.setItem('ecobot-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ecobot-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ecobot-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ecobot-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ecobot-authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isMounted = true;

    async function syncUserProfile() {
      setLoadingUser(true);
      try {
        const refreshedUser = await getUserById(user.id);
        if (!isMounted) {
          return;
        }

        if (isMounted && refreshedUser.id !== user.id) {
          setUser(refreshedUser);
        }

        if (refreshedUser.preferences) {
          setTheme(refreshedUser.preferences.theme || 'light');
          setNotifications(
            typeof refreshedUser.preferences.notifications === 'boolean'
              ? refreshedUser.preferences.notifications
              : true
          );
          setLanguage(refreshedUser.preferences.language || 'pt-BR');
        }
      } catch (error) {
        console.error('Falha ao sincronizar perfil do usuário', error);
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    }

    if (isAuthenticated) {
      syncUserProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const login = async ({ email, password }) => {
    const authenticatedUser = await loginRequest({ email, password });
    setUser(authenticatedUser);
    setTheme(authenticatedUser.preferences?.theme || 'light');
    setNotifications(
      typeof authenticatedUser.preferences?.notifications === 'boolean'
        ? authenticatedUser.preferences.notifications
        : true
    );
    setLanguage(authenticatedUser.preferences?.language || 'pt-BR');
    setIsAuthenticated(true);
    return authenticatedUser;
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUser(DEFAULT_USER);
    clearAuthSession();
  };
  const registerUser = async ({ name, email, password }) => {
    return registerRequest({ name, email, password });
  };

  const saveProfile = async ({ name, email, role, avatar }) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    const updatedUser = await updateUserProfile(user.id, { name, email, role, avatar });
    setUser(updatedUser);
    return updatedUser;
  };

  const saveSettings = async ({ nextTheme, nextNotifications, nextLanguage }) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    const updatedUser = await updateUserPreferences(user.id, {
      theme: nextTheme,
      notifications: nextNotifications,
      language: nextLanguage
    });
    setUser(updatedUser);
    setTheme(updatedUser.preferences?.theme || 'light');
    setNotifications(
      typeof updatedUser.preferences?.notifications === 'boolean'
        ? updatedUser.preferences.notifications
        : true
    );
    setLanguage(updatedUser.preferences?.language || 'pt-BR');
    return updatedUser;
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      notifications,
      setNotifications,
      language,
      setLanguage,
      user,
      setUser,
      loadingUser,
      isAuthenticated,
      login,
      logout,
      registerUser,
      saveProfile,
      saveSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
