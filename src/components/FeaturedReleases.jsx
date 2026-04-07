import ProductCard from './ProductCard';
import './FeaturedReleases.css';

const MOCK_PRODUCTS = [
  {
    id: 1,
    image: '/sneaker1.png',
    brand: 'Nike',
    name: 'NIKE DUNK LOW "PANDA"',
    price: 110,
    rating: 5,
  },
  {
    id: 2,
    image: '/sneaker3.png',
    brand: 'Adidas',
    name: 'YEEZY 350 V2 "ZEBRA"',
    price: 220,
    rating: 4.8,
  },
  {
    id: 3,
    image: '/sneaker2.png',
    brand: 'Jordan',
    name: 'AIR JORDAN 1 "CHICAGO LOST & FOUND"',
    price: 180,
    rating: 5,
  },
  {
    id: 4,
    image: '/sneaker1.png',
    brand: 'New Balance',
    name: 'NEW BALANCE 550',
    price: 140,
    rating: 4.5,
  }
];

const FeaturedReleases = () => {
  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">FEATURED RELEASES</h2>
      </div>

      <div className="products-grid">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} {...product} />
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
