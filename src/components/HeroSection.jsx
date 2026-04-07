import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            STEP UP YOUR GAME.<br/>
            <span className="text-gradient">EXPLORE THE LATEST RELEASES.</span>
          </h1>
          <p className="hero-description">Discover the most exclusive drops and elevate your sneaker collection to the next level.</p>
          <button className="btn-primary hero-btn">SHOP NOW</button>
        </div>
        <div className="hero-image-wrapper">
          <img src="/sneaker1.png" alt="Featured Sneaker" className="hero-main-image" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
