import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, id, setId, venta } = useAuth(); // 'venta' es la función del Context
  const { obtenerIdProducto } = useProductos();

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

        // Armamos los detalles de la venta con el formato específico
        const nuevosDetalles = await Promise.all(cartItems.map(async (item) => {
          // Hacemos la solicitud GET para traer los datos del producto
          const productoDB = await obtenerIdProducto(item.id);
          console.log(`Producto consultado (ID: ${item.id}):`, productoDB);

          // Buscamos la variante que coincide con el color y talla del carrito
          let variante_id = null; 
          
          // En DetallesProductos parece que la respuesta en sí es el arreglo de variantes
          const variantes = Array.isArray(productoDB) ? productoDB : (productoDB?.variantes || []);

          if (variantes.length > 0) {
            const varianteEncontrada = variantes.find(v => 
              v.color === item.color && v.talla === item.talla
            );
            
            // Si la encontramos, asignamos su id, sino tomamos la primera
            if (varianteEncontrada) {
              variante_id = varianteEncontrada.id;
            } else {
              variante_id = variantes[0].id;
            }
          }

          return {
            venta_id: resultado.id,
            producto_id: item.id, 
            cantidad: item.cantidad,
            variante_id: variante_id
          };
        }));
        
        console.log("detallesVenta:", nuevosDetalles);
        setDetallesVenta(nuevosDetalles);

        // Enviamos los detalles de la venta mediante POST respetando la sincronía
        const respuestaDetalles = await fetch('http://localhost:8080/confirmar/detalles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(nuevosDetalles)
        });

        if (respuestaDetalles.ok) {
          console.log("Detalles guardados exitosamente en el servidor");
          
          await Swal.fire({
            icon: 'success',
            title: '¡Compra Exitosa!',
            text: 'Tu pedido se ha procesado correctamente.',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#3085d6'
          });

          // Si todo salió bien, vaciamos el carrito y redirigimos a los productos
          clearCart();
          navigate('/productos');
        } else {
          console.error("Hubo un problema al guardar los detalles");
          await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al guardar los detalles de la venta.',
            confirmButtonColor: '#d33'
          });
        }
      }
    } catch (error) {
      console.error("Error al procesar el pago en el submit:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Ocurrió un error al procesar la compra. Intenta de nuevo.',
        confirmButtonColor: '#d33'
      });
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