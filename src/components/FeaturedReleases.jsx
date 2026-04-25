import React, { useEffect, useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { useProductos } from '../context/ProductosContext';
import './FeaturedReleases.css';

const FeaturedReleases = () => {
  const { obtenerProductos, productos } = useProductos();
  const [cargando, setCargando] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const cargarData = async () => {
      if (productos.length === 0) {
        await obtenerProductos();
      }
      setCargando(false);
    };
    cargarData();
  }, [productos.length, obtenerProductos]);

  const productosDestacados = productos.slice(0, 8); // Showing up to 8 products now

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth > 768 ? 300 : carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth > 768 ? 300 : carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // If we've reached the end, scroll back to the start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const scrollAmount = clientWidth > 768 ? 300 : clientWidth;
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">LANZAMIENTOS DESTACADOS</h2>
      </div>

      <div className="carousel-wrapper">
        <button className="carousel-btn left" onClick={scrollLeft} aria-label="Scroll left">
          &#10094;
        </button>

        <div className="carousel-container" ref={carouselRef}>
          {cargando ? (
            <p>Cargando destacados...</p>
          ) : productosDestacados.length > 0 ? (
            productosDestacados.map((product) => (
              <div className="carousel-item" key={product.id}>
                <ProductCard producto={product} />
              </div>
            ))
          ) : (
            <p>No hay productos destacados disponibles.</p>
          )}
        </div>

        <button className="carousel-btn right" onClick={scrollRight} aria-label="Scroll right">
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default FeaturedReleases;
