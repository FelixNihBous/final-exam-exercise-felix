// context/AppContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create Context
const AppContext = createContext(null);

// 2. Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  // This check correctly ensures the hook is only used inside the Provider
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// 3. Provider Component
export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // SAFE: This conditional ensures localStorage is only accessed in the browser
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    }
    return 'light'; // Default theme for server and initial client render
  });

  // --- USER STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [selectedMajor, setSelectedMajor] = useState(null);

  // 4. Save Theme to Browser Storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]); 

  // --- HELPER FUNCTIONS ---
  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
  };

  const changeTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  const loginUser = (name = 'Felix', major = 'smartphones') => {
    setUserName(name);
    setIsLoggedIn(true);
    setSelectedMajor(major);
  };

  const logoutUser = () => {
    setUserName('Guest');
    setIsLoggedIn(false);
    setSelectedMajor(null);
  };

  // 5. Context Value
  const value = {
    theme,
    toggleTheme,
    changeTheme,
    isLoggedIn,
    userName,
    selectedMajor,
    setSelectedMajor,
    loginUser,
    logoutUser,
  };

  // 6. Provide Context
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;