import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import { ScriptProvider } from './context/ScriptContext';

import { ThemeProvider } from './context/ThemeContext';

// TODO: Register Service Worker here

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ScriptProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ScriptProvider>
  </React.StrictMode>
);
