import React from 'react';
import './Perfil.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Perfil = () => {
    const { user, isLogin, cerrarSesion } = useAuth();

    if (!isLogin) {
        return <Navigate to="/inicioSesion" />;
    }

    return (
        <div className="perfil-page-container">
            <Navbar />
            <div className="perfil-content">
                <div className="perfil-box">
                    <div className="perfil-header">
                        <h2>Mi Perfil</h2>
                        <p>Gestiona tu información personal y configuración</p>
                    </div>

                    <div className="perfil-info">
                        <div className="info-group">
                            <label>Usuario</label>
                            <p>{user || 'No disponible'}</p>
                        </div>
                        <div className="info-group">
                            <label>Estado</label>
                            <p style={{ color: '#4caf50' }}>Activo</p>
                        </div>
                    </div>

                    <div className="perfil-actions">
                        <button className="btn-secondary">
                            Editar Información
                        </button>
                        <button className="btn-secondary">
                            Cambiar Contraseña
                        </button>
                        <button className="btn-danger" onClick={cerrarSesion}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Perfil;
