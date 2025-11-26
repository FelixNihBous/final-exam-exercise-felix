import React, { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import './globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <AppProvider> 
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;