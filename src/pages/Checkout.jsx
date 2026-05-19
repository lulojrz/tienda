import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, id, setId, venta } = useAuth(); // 'venta' es la función del Context

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    ciudad: "",
    cp: "",
    metodoPago: "efectivo", // Valor por defecto para evitar errores
    montoTotal: getCartTotal()
  });
  const [detallesVenta, setDetallesVenta] = useState([{

  }]);

  useEffect(() => {
    const savedId = localStorage.getItem("id");
    if (savedId) {
      setId(savedId);
    }
  }, [setId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Armamos el objeto limpio para la tabla 'ventas' (Cabecera)
    const datosVenta = {
      cliente: { id: Number(id) },
      montoTotal: formData.montoTotal,
      metodoPago: formData.metodoPago,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      cp: formData.cp,
      fecha: new Date().toISOString()
    };

    try {
      console.log("Enviando cabecera de venta:", datosVenta);

      // 2. Ejecutamos la petición asincrónica al backend
      const resultado = await venta(datosVenta);
      console.log("Respuesta del servidor (Cabecera guardada):", resultado);

      if (resultado && resultado.id) {
        // !!! ACÁ TENÉS EL ID AUTOGENERADO POR SPRINT BOOT !!!
        console.log("ID de la venta creada:", resultado.id);

        // Aquí vas a llamar a tu segunda función para guardar los detalles:
        // await guardarDetallesDeVenta(resultado.id, cartItems);



        // O a donde quieras redirigir al éxito
      }
    } catch (error) {
      console.error("Error al procesar el pago en el submit:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Si el carrito está vacío, mostrar mensaje de advertencia
  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <h2>Tu carrito está vacío</h2>
        <p>No tienes productos para comprar.</p>
        <button className="btn-primary" onClick={() => navigate('/productos')}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Finalizar Compra</h1>
        <p>Completa tus datos para procesar el pedido</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit} className="checkout-form">

            <div className="form-group-section">
              <h3>Datos de Envío</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input type="text" id="apellido" name="apellido" required value={formData.apellido} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección de Envío</label>
                <input type="text" id="direccion" name="direccion" required value={formData.direccion} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input type="text" id="ciudad" name="ciudad" required value={formData.ciudad} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="cp">Código Postal</label>
                  <input type="text" id="cp" name="cp" required value={formData.cp} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group-section">
              <h3>Información de Pago</h3>

              <div className="payment-methods">
                <label className={`payment-method-label ${formData.metodoPago === 'tarjeta' ? 'active' : ''}`}>
                  <input type="radio" name="metodoPago" value="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleChange} />
                  Tarjeta de Crédito/Débito
                </label>
                <label className={`payment-method-label ${formData.metodoPago === 'transferencia' ? 'active' : ''}`}>
                  <input type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleChange} />
                  Transferencia Bancaria
                </label>
                <label className={`payment-method-label ${formData.metodoPago === 'efectivo' ? 'active' : ''}`}>
                  <input type="radio" name="metodoPago" value="efectivo" checked={formData.metodoPago === 'efectivo'} onChange={handleChange} />
                  Efectivo
                </label>
              </div>

              {formData.metodoPago === 'tarjeta' && (
                <div className="card-details-section">
                  <div className="form-group">
                    <label htmlFor="nombreTarjeta">Nombre en la tarjeta</label>
                    <input type="text" id="nombreTarjeta" name="nombreTarjeta" required value={formData.nombreTarjeta || ''} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numeroTarjeta">Número de tarjeta</label>
                    <input
                      type="text"
                      id="numeroTarjeta"
                      name="numeroTarjeta"
                      required
                      maxLength="19"
                      placeholder="0000 0000 0000 0000"
                      value={formData.numeroTarjeta || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fechaExpiracion">Fecha de Expiración</label>
                      <input
                        type="text"
                        id="fechaExpiracion"
                        name="fechaExpiracion"
                        required
                        placeholder="MM/AA"
                        maxLength="5"
                        value={formData.fechaExpiracion || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        required
                        maxLength="4"
                        placeholder="123"
                        value={formData.cvv || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.metodoPago === 'transferencia' && (
                <div className="payment-info-box">
                  <p>Al finalizar la compra, te enviaremos los datos bancarios (CBU/Alias) a tu correo electrónico para que realices la transferencia.</p>
                </div>
              )}

              {formData.metodoPago === 'efectivo' && (
                <div className="payment-info-box">
                  <p>Podrás abonar en efectivo al momento de recibir tu pedido o al retirarlo por la sucursal.</p>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary submit-checkout-btn">
              Confirmar y Pagar {formatPrice(getCartTotal())}
            </button>
          </form>
        </div>

        <div className="checkout-summary-section">
          <h3>Resumen del Pedido</h3>
          <div className="checkout-items">
            {cartItems.map((item, index) => (
              <div className="checkout-item" key={`${item.id}-${index}`}>
                <div className="checkout-item-image">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
                <div className="checkout-item-details">
                  <h4>{item.nombre}</h4>
                  <div className="checkout-item-variants">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.talla && <span>Talle: {item.talla}</span>}
                  </div>
                  <span className="checkout-item-qty">Cant: {item.cantidad}</span>
                </div>
                <div className="checkout-item-price">
                  {formatPrice(item.precio * item.cantidad)}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            <div className="checkout-total-row">
              <span>Envío</span>
              <span className="free-shipping">¡Gratis!</span>
            </div>
            <div className="checkout-total-row grand-total">
              <span>Total a pagar</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;