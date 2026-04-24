import { useState } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isLogin, cerrarSesion } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
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
          <li><NavLink to="/productos">PRODUCTOS</NavLink></li>
        </ul>

        <div className="navbar-icons">
          {!isLogin ? (
            <Link to="/inicioSesion">
              <button className="icon-btn" aria-label="User Account">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </button>
            </Link>
          ) : (
            <div className="user-info-container">
              <button className="icon-btn" aria-label="User Info" onClick={() => setShowUserModal(!showUserModal)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>

              {showUserModal && (
                <div className="user-modal">
                  <div className="user-modal-content">
                    <div className="user-modal-header">
                      <h4>Mi Perfil</h4>
                    </div>
                    <div className="user-modal-body">
                      <p><strong>Usuario:</strong> {user}</p>
                      <p className="status-online" >
                        <span className="status-dot"></span> Conectado
                      </p>
                      <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '15px' }}
                        onClick={() => { cerrarSesion(); setShowUserModal(false); }}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
