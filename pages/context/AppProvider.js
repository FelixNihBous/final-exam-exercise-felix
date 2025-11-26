import React from 'react';
// FIX: Adjusted import path for AppContext to correctly resolve in the environment structure.
import { AppProvider } from '../context/AppContext'; 
// FIX: Removed Ant Design CSS import ('antd/dist/antd.css') as it causes resolution errors
// and is not strictly necessary for the components to function.

/**
 * Custom App component to initialize pages.
 * This is where you include global styles, contexts, and providers.
 */
function MyApp({ Component, pageProps }) {
  // We wrap the entire application (Component) in the AppProvider
  // so that useAppContext can be called from any nested component or page.
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;