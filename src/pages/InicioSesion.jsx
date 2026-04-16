import React, { useState } from 'react';
import './InicioSesion.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const InicioSesion = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado", formData);
        // Aquí iría la lógica de autenticación
    };

    return (
        <div className="auth-page-container">
            <Navbar />
            <div className="auth-content">
                <div className="auth-box">
                    <div className="auth-header">
                        <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                        <p>{isLogin ? 'Ingresa tus credenciales para continuar' : 'Únete a nuestra comunidad hoy mismo'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Juan Pérez"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isLogin && (
                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Recordarme</span>
                                </label>
                                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                            </div>
                        )}

                        <button type="submit" className="btn-primary auth-submit">
                            {isLogin ? 'Ingresar' : 'Registrarse'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                            <button
                                type="button"
                                className="toggle-auth-btn"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InicioSesion;