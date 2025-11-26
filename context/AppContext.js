import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [selectedMajor, setSelectedMajor] = useState(null);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

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

  const value = useMemo(() => ({
    theme,
    isLoggedIn,
    userName,
    selectedMajor,
    setTheme,
    toggleTheme,
    setIsLoggedIn,
    setUserName,
    setSelectedMajor,
    loginUser,
    logoutUser,
  }), [theme, isLoggedIn, userName, selectedMajor]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
