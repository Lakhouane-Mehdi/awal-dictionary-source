import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import App from './App';
import './styles/global.css';
import { ScriptProvider } from './context/ScriptContext';
import { ThemeProvider } from './context/ThemeContext';
import { initMonitoring } from './utils/monitoring';
import { ErrorFallback } from './components/ErrorFallback';

// Initialize Sentry if configured
initMonitoring();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
      <ErrorFallback error={error instanceof Error ? error : undefined} resetError={resetError} />
    )}>
      <ScriptProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ScriptProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
