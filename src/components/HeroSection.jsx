import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            ELEVA TU NIVEL.<br/>
            <span className="text-gradient">EXPLORA LOS NUEVOS LANZAMIENTOS.</span>
          </h1>
          <p className="hero-description">Descubre las entregas más exclusivas y lleva tu colección de zapatillas al siguiente nivel.</p>
          <button className="btn-primary hero-btn">COMPRAR AHORA</button>
        </div>
        <div className="hero-image-wrapper">
          <img src="/sneaker1.png" alt="Featured Sneaker" className="hero-main-image" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
