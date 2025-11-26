// pages/_app.js

import React from 'react';
import { AppProvider } from '../context/AppContext';
import './globals.css';

function MyApp({ Component, pageProps }) {
  // FIX: The AppProvider must wrap the Component on both server and client.
  // The logic inside AppProvider handles browser-specific code safely.
  
  return (
    <AppProvider> 
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;