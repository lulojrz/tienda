import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="hot-pick-banner">
          <div className="hot-pick-content">
            <span className="hot-pick-badge">THIS WEEK'S HOT PICK</span>
            <h2 className="hot-pick-title">AIR JORDAN 4 'BRED REIMAGINED'</h2>
            <button className="btn-primary">SHOP NOW</button>
          </div>
          <div className="hot-pick-image-container">
             <img src="/sneaker2.png" alt="Jordan 4 Bred" className="hot-pick-image" />
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">FAQs</a>
            <a href="#">Shipping</a>
          </div>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="#" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
          </div>

          <div className="footer-newsletter">
             <p className="newsletter-title">SUBSCRIBE FOR EXCLUSIVE OFFERS</p>
             <div className="newsletter-input-group">
                <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                <button className="btn-primary newsletter-btn">→</button>
             </div>
             <div className="payment-icons">
               <span className="payment-icon">VISA</span>
               <span className="payment-icon">MC</span>
               <span className="payment-icon">PayPal</span>
               <span className="payment-icon">GPay</span>
             </div>
          </div>
        </div>

        <div className="footer-copyright">
          <span>SOLESTREET</span>
          <p>© 2024 SOLESTREET. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
