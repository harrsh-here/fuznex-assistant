// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1a1a]">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </div>
  </React.StrictMode>
);
