import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { ProductosProvider } from './context/ProductosContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProductosProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ProductosProvider>
  </BrowserRouter>
)
