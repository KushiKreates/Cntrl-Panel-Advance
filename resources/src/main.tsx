/// <reference types="vite/client" />

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './index.css'; // Ensure you have a CSS file for global styles
import 'nprogress/nprogress.css'; // Import NProgress CSS

import { Toaster } from 'sonner';
import NadhiLoader from './components/Loader/Nadhi.dev';

// The loader get's hidden when react is ready
const hideLoadingScreen = () => {
  const loadingScreen = document.querySelector('.app-loading');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.remove();
      document.body.classList.remove('loading');
    }, 300);
  }
};

/**
 * Prevents full page reloads, its soo fucked up.
 * This is a workaround for Vite's HMR issues.
 * It will throw an error to skip the full reload.
 * This is a temporary fix until Vite fixes their HMR.
 * 
 * Fix found at - https://designdebt.club/prevent-vite-doing-a-full-reload/
 * 
 * Thank you for this bit of code Mr, nadhi.dev -
 */

if (import.meta.hot) {
   import.meta.hot.on('vite:beforeFullReload', () => {
     console.log("Reloading this thing again.")
      throw '(skipping full reload)';
   });
}

// Wait for dom updates
const waitForDOMReady = () => {
  return new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', () => resolve());
    }
  });
};

// Enhanced Suspense fallback that works with loading screen, cuz cool!
const AppFallback = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
    <NadhiLoader />
  </div>
);

// Main App component wrapper
const App = () => (
  <div className="app-container">
    <Suspense fallback={<AppFallback />}>
      {!window.location.pathname.startsWith('/home/checkout') && <Toaster />}
      <RouterProvider router={router} />
    </Suspense>
  </div>
);

// Main render function
const renderApp = async () => {
  // Wait for DOM to be fully ready
  await waitForDOMReady();
  
  // Small delay to ensure smooth transition
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Create root and render
  const root = ReactDOM.createRoot(document.getElementById('nadhi.dev-app')!);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Hide loading screen after app renders
  setTimeout(hideLoadingScreen, 150);
  
  // Handle hot module replacement
  if (import.meta.hot) {
    import.meta.hot.accept('./router', () => {
      // Don't show loading screen on HMR updates
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    });
  }
};

// Start the app
renderApp().catch(console.error);