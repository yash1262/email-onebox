import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/variables.css';

console.log('main.tsx loaded');

const root = document.getElementById('root');
console.log('root element:', root);

if (root) {
  try {
    console.log('Creating React root');
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React app rendered');
  } catch (e) {
    console.error('Error rendering app:', e);
    root.innerHTML = '<div style="padding: 20px; color: red;"><h1>Error</h1><p>' + String(e) + '</p></div>';
  }
} else {
  console.error('Root element not found');
}
