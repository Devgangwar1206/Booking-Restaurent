import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react';
import { CartProvider } from './context/CartContext';
import { TableHoldProvider } from './context/TableHoldContext';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TableHoldProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </TableHoldProvider>
    </BrowserRouter>
  </React.StrictMode>
)
