import React from 'react';
// FIX: Changing the import path to './context/AppContext'. This is a highly likely workaround 
// if the compiler is incorrectly treating the 'context' folder as a sibling or sub-folder
// to the 'pages' directory in its flattened structure.
import { AppProvider } from './context/AppContext'; 

/**
 * Custom App component to initialize pages.
 * This is where you include global styles, contexts, and providers.
 */
function MyApp({ Component, pageProps }) {
  return (
    <AppProvider> 
      {/* This wraps every page (Component) in the application */}
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;