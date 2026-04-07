import './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 21A10 10 0 1 0 12 3a10 10 0 0 0 0 18z" />
            <path d="M15 14c-2 0-3-1-3-1s-1 1-3 1-2-1-2-1" />
          </svg>
          <span>SOLESTREET</span>
        </div>

        <ul className="navbar-links">
          <li><NavLink to="/">INICIO</NavLink></li>
          <li><NavLink to="/productos">NUEVOS PRODUCTOS</NavLink></li>
          <li><NavLink to="/hombre">HOMBRE</NavLink></li>
          <li><NavLink to="/mujer">MUJER</NavLink></li>
        </ul>

        <div className="navbar-icons">
          <button className="icon-btn" aria-label="User Account">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
          <button className="icon-btn" aria-label="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </button>
          <button className="icon-btn cart-btn" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            <span className="cart-badge">2</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
