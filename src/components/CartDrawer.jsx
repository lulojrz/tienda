import React from 'react';
import './CartDrawer.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal 
  } = useCart();
  
  const { isLogin } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLogin) {
      closeCart();
      navigate('/inicioSesion');
    } else {
      // Por ahora solo mostrar un alert ya que no hay página de checkout
      alert('Procesando pago... ¡Gracias por tu compra!');
      // clearCart(); podria llamarse después de un pago exitoso
      closeCart();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      {/* Overlay de fondo oscuro cuando el carrito está abierto */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={closeCart}
      ></div>

      {/* Panel del carrito */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          <button className="close-cart-btn" onClick={closeCart} aria-label="Cerrar Carrito">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Tu carrito está vacío.</p>
              <button className="btn-secondary" onClick={closeCart}>
                Explorar productos
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div className="cart-item" key={`${item.id}-${item.color}-${item.talla}-${index}`}>
                <div className="cart-item-image">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
                
                <div className="cart-item-details">
                  <div className="cart-item-title-row">
                    <h4>{item.nombre}</h4>
                    <button 
                      className="remove-item-btn" 
                      onClick={() => removeFromCart(item.id, item.color, item.talla)}
                      title="Eliminar producto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="cart-item-variants">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.talla && <span>Talle: {item.talla}</span>}
                  </div>
                  
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">{formatPrice(item.precio)}</span>
                    
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.color, item.talla, -1)}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.color, item.talla, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            
            {!isLogin && (
              <div className="cart-auth-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Debes iniciar sesión para comprar.</span>
              </div>
            )}
            
            <button className="btn-primary checkout-btn" onClick={handleCheckout}>
              {isLogin ? 'Proceder al Pago' : 'Iniciar Sesión para Pagar'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
