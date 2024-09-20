import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Adjust the path as necessary
import { ThemeProvider } from './context/ThemeContext'; // Adjust the path as necessary
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
     
        <App />
    </ThemeProvider>
  </React.StrictMode>
);
