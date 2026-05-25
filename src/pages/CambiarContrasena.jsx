import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import './CambiarContrasena.css';

const CambiarContrasena = () => {
    const { id, isLogin, datosClientes, verificarCredenciales, editarUsuario } = useAuth();
    const navigate = useNavigate();
    
    const [clienteOriginal, setClienteOriginal] = useState(null);
    const [fase, setFase] = useState(1); // 1 = Verificar, 2 = Nueva Contraseña
    const [loading, setLoading] = useState(true);
    
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    useEffect(() => {
        if (!isLogin) {
            navigate('/inicioSesion');
            return;
        }

        const fetchData = async () => {
            const userId = id || sessionStorage.getItem('id') || localStorage.getItem('id');
            if (userId) {
                const clientInfo = await datosClientes(userId);
                if (clientInfo) {
                    setClienteOriginal(clientInfo);
                }
            }
            setLoading(false);
        };
        
        fetchData();
    }, [id, isLogin, navigate, datosClientes]);

    const handleVerificar = async (e) => {
        e.preventDefault();
        if (!contrasenaActual) return;

        const userId = id || sessionStorage.getItem('id') || localStorage.getItem('id');
        const credenciales = {
            usuario: clienteOriginal.usuario,
            password: contrasenaActual
        };

        const success = await verificarCredenciales(userId, credenciales);
        if (success) {
            setFase(2);
        }
    };

    const handleCambiar = async (e) => {
        e.preventDefault();
        if (nuevaContrasena !== confirmarContrasena) {
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
            return;
        }
        if (nuevaContrasena.length < 4) {
             Swal.fire({
                title: "Error",
                text: "La contraseña es muy corta.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
            return;
        }

        const userId = id || sessionStorage.getItem('id') || localStorage.getItem('id');
        
        const bodyToSend = { 
            ...clienteOriginal, 
            password: nuevaContrasena 
        };

        const success = await editarUsuario(userId, bodyToSend);
        if (success) {
            navigate('/perfil');
        }
    };

    if (loading) {
        return (
            <div className="cambiar-contrasena-container">
                <Navbar />
                <div className="cambiar-contrasena-content">
                    <p style={{ color: '#fff' }}>Cargando datos...</p>
                </div>
                <Footer hideFeatured={true} />
            </div>
        );
    }

    return (
        <div className="cambiar-contrasena-container">
            <Navbar />
            <div className="cambiar-contrasena-content">
                <div className="cambiar-contrasena-box">
                    <h2>Cambiar Contraseña</h2>
                    
                    {fase === 1 ? (
                        <form onSubmit={handleVerificar} className="contrasena-form">
                            <p className="form-instruction">Ingresa tu contraseña actual para verificar tu identidad.</p>
                            <div className="form-group">
                                <label htmlFor="contrasenaActual">Contraseña Actual</label>
                                <input 
                                    type="password" 
                                    id="contrasenaActual" 
                                    value={contrasenaActual} 
                                    onChange={(e) => setContrasenaActual(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => navigate('/perfil')}>Cancelar</button>
                                <button type="submit" className="btn-primary">Verificar</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleCambiar} className="contrasena-form">
                            <p className="form-instruction">Ingresa tu nueva contraseña.</p>
                            <div className="form-group">
                                <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    id="nuevaContrasena" 
                                    value={nuevaContrasena} 
                                    onChange={(e) => setNuevaContrasena(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    id="confirmarContrasena" 
                                    value={confirmarContrasena} 
                                    onChange={(e) => setConfirmarContrasena(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setFase(1)}>Volver</button>
                                <button type="submit" className="btn-primary">Guardar Nueva Contraseña</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <Footer hideFeatured={true} />
        </div>
    );
};

export default CambiarContrasena;
