import './ProductCard.css';
import { Link } from 'react-router-dom';
import { useProductos } from '../context/ProductosContext';

const ProductCard = ({ producto }) => {
  const { filtrarProducto } = useProductos();

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={producto.imagen_principal} alt={producto.nombre} className="product-image" />
      </div>
      <div className="product-info">
        <p className="product-brand">{producto.marca}</p>
        <h3 className="product-name">{producto.nombre}</h3>

        <div className="product-details-row">
          <p className="product-price">${producto.precioBase}</p>
          {/*  <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(rating) ? "var(--star-color)" : "none"} stroke="var(--star-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            ))}
          </div>*/}
        </div>

        <div className="product-actions">
          <button className="btn-primary flex-1">AGREGAR</button>
          <Link to={`/productos/${producto.id}`}>
            <button className="btn-secondary flex-1" onClick={() => filtrarProducto(producto.id)}>VER DETALLES</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
