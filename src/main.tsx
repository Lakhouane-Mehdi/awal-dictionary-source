import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './styles/global.css';
import { ScriptProvider } from './context/ScriptContext';
import { ThemeProvider } from './context/ThemeContext';
import { GamificationProvider } from './context/GamificationContext';
import { initMonitoring } from './utils/monitoring';
import { ErrorFallback } from './components/ErrorFallback';

// Starts Sentry only if a DSN is set and the visitor consented to analytics
void initMonitoring();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
      <ErrorFallback error={error instanceof Error ? error : undefined} resetError={resetError} />
    )}>
      <ScriptProvider>
        <ThemeProvider>
          <GamificationProvider>
            <BrowserRouter>
              {/* Animations follow the visitor's reduced-motion setting */}
              <MotionConfig reducedMotion="user">
                <App />
              </MotionConfig>
            </BrowserRouter>
          </GamificationProvider>
        </ThemeProvider>
      </ScriptProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
