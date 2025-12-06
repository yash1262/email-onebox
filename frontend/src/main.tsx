import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Fallback } from './Fallback';
import './styles/globals.css';
import './styles/variables.css';

try {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  
  ReactDOM.createRoot(root).render(
    <React.Suspense fallback={<Fallback />}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </React.Suspense>
  );
} catch (error) {
  console.error('Failed to mount app:', error);
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(<Fallback />);
  }
}
