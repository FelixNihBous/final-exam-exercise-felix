import React, { createContext, useContext, useState, useEffect } from 'react';


const AppContext = createContext(null);


export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// ===== STEP 3: Create Provider Component =====
export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    }
    return 'light'; // Default theme
  });

  // --- USER STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [selectedMajor, setSelectedMajor] = useState(null);

  // ===== STEP 4: Save Theme to Browser Storage =====
  // Whenever theme changes, save it so it persists after page reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('app_theme', theme);
      
      // Add 'data-theme' attribute to HTML element
      // CSS can then target it: [data-theme="dark"] { ... }
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]); // Run this effect only when 'theme' changes

  // ===== STEP 5: Create Helper Functions =====
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(currentTheme => 
      currentTheme === 'light' ? 'dark' : 'light'
    );
  };

  // Manually set theme to 'light' or 'dark'
  const changeTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  // --- USER HELPER FUNCTIONS ---
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

  // ===== STEP 6: Create Value Object =====
  // This object will be shared with all components using this context
  const value = {
    // Theme state and functions
    theme,
    toggleTheme,
    changeTheme,
    
    // User state and functions
    isLoggedIn,
    userName,
    selectedMajor,
    loginUser,
    logoutUser,
  };

  // ===== STEP 7: Provide Context to All Components =====
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
