import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import './InicioSesion.css';

const OlvidoContrasena = () => {
    const [identificador, setIdentificador] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simular petición al backend
        if (identificador) {
            Swal.fire({
                title: "Solicitud enviada",
                text: "Si existe una cuenta asociada a ese usuario o correo, recibirás instrucciones para recuperar tu contraseña.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                navigate('/inicioSesion');
            });
        }
    };

    return (
        <div className="auth-page-container">
            <Navbar />
            <div className="auth-content">
                <div className="auth-box">
                    <div className="auth-header">
                        <h2>Recuperar Contraseña</h2>
                        <p>Ingresa tu usuario o correo electrónico y te enviaremos las instrucciones.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="identificador">Usuario o Email</label>
                            <input
                                type="text"
                                id="identificador"
                                name="identificador"
                                placeholder="Tu usuario o correo"
                                value={identificador}
                                onChange={(e) => setIdentificador(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary auth-submit">
                            Enviar Instrucciones
                        </button>
                    </form>

                    <div className="auth-footer" style={{ marginTop: '20px' }}>
                        <p>
                            ¿Recordaste tu contraseña?{' '}
                            <Link to="/inicioSesion" className="toggle-auth-btn" style={{ textDecoration: 'none' }}>
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OlvidoContrasena;
