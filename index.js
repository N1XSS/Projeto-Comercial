import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Vamos criar este arquivo a seguir (opcional para estilos globais básicos)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
