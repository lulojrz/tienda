import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useProductos } from '../context/ProductosContext';
import './FeaturedReleases.css';

const FeaturedReleases = () => {
  const { obtenerProductos, productos } = useProductos();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarData = async () => {
      if (productos.length === 0) {
        await obtenerProductos();
      }
      setCargando(false);
    };
    cargarData();
  }, [productos.length, obtenerProductos]);

  // Mostrar los primeros 4 productos destacados, o menos si hay pocos
  const productosDestacados = productos.slice(0, 4);

  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">LANZAMIENTOS DESTACADOS</h2>
      </div>

      <div className="products-grid">
        {cargando ? (
          <p>Cargando destacados...</p>
        ) : productosDestacados.length > 0 ? (
          productosDestacados.map((product) => (
            <ProductCard key={product.id} producto={product} />
          ))
        ) : (
          <p>No hay productos destacados disponibles.</p>
        )}
      </div>

      {productosDestacados.length > 0 && (
        <div className="slider-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
    </section>
  );
};

export default FeaturedReleases;
