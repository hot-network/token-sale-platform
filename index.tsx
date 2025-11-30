import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TokenSaleProvider } from './contexts/TokenSaleContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { logger } from './services/logger';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <NetworkProvider>
        <TokenSaleProvider>
          <App />
        </TokenSaleProvider>
      </NetworkProvider>
    </React.StrictMode>
  );
};

// Defer the execution of the app until the DOM is fully loaded.
// This prevents race conditions where the script runs before the #root element exists.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}

// Register the service worker for PWA functionality
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      logger.info('[ServiceWorker]', 'Registration successful, scope is:', registration.scope);
    } catch (err) {
      logger.error('[ServiceWorker]', 'Registration failed:', err);
    }
  }
};

// We register the SW on window load to not delay rendering the app.
window.addEventListener('load', () => {
  registerServiceWorker();
});