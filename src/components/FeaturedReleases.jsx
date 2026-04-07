import ProductCard from './ProductCard';
import './FeaturedReleases.css';

const MOCK_PRODUCTS = [
  {
    id: 1,
    imagen_principal: '/sneaker1.png',
    marca: 'Nike',
    nombre: 'NIKE DUNK LOW "PANDA"',
    precioBase: 110,
    rating: 5,
  },
  {
    id: 2,
    imagen_principal: '/sneaker3.png',
    marca: 'Adidas',
    nombre: 'YEEZY 350 V2 "ZEBRA"',
    precioBase: 220,
    rating: 4.8,
  },
  {
    id: 3,
    imagen_principal: '/sneaker2.png',
    marca: 'Jordan',
    nombre: 'AIR JORDAN 1 "CHICAGO LOST & FOUND"',
    precioBase: 180,
    rating: 5,
  },
  {
    id: 4,
    imagen_principal: '/sneaker1.png', 
    marca: 'New Balance',
    nombre: 'NEW BALANCE 550',
    precioBase: 140,
    rating: 4.5,
  }
];

const FeaturedReleases = () => {
  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">LANZAMIENTOS DESTACADOS</h2>
      </div>

      <div className="products-grid">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} producto={product} />
        ))}
      </div>

      <div className="slider-dots">
        <div className="dot active"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </section>
  );
};

export default FeaturedReleases;
