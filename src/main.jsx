import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { ProductosProvider } from './context/ProductosContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ProductosProvider>
        <CartProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </CartProvider>
      </ProductosProvider>
    </AuthProvider>
  </BrowserRouter>
)
