import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // 1. Theme State
    const [theme, setTheme] = useState('light');

    // Other States
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('Guest');
    const [selectedMajor, setSelectedMajor] = useState(null);

    // Theme Toggle Function
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // User Management Functions
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

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        // State values
        theme,
        isLoggedIn,
        userName,
        selectedMajor,

        // State update functions
        setTheme,
        toggleTheme, // Exposing the toggle function for theme switching
        setIsLoggedIn,
        setUserName,
        setSelectedMajor,
        loginUser,
        logoutUser,
    }), [theme, isLoggedIn, userName, selectedMajor]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};