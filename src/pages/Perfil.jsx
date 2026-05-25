import React, { useState, useEffect } from 'react';
import './Perfil.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Perfil = () => {
    const { user, isLogin, cerrarSesion, id, datosClientes } = useAuth();
    const [compras, setCompras] = useState([]);
    const [clienteData, setClienteData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const userId = id || sessionStorage.getItem('id') || localStorage.getItem('id');
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            
            if (userId && token) {
                try {
                    const clientInfo = await datosClientes(userId);
                    if (clientInfo) setClienteData(clientInfo);

                    const response = await fetch(`http://localhost:8080/confirmar/venta/cliente/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCompras(data);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (isLogin) {
            fetchData();
        }
    }, [id, isLogin, datosClientes]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                            <label>Nombre y Apellido</label>
                            <p>{clienteData ? `${clienteData.nombre} ${clienteData.apellido}` : 'Cargando...'}</p>
                        </div>
                        <div className="info-group">
                            <label>Usuario</label>
                            <p>{user || 'No disponible'}</p>
                        </div>
                        <div className="info-group">
                            <label>Estado</label>
                            <p style={{ color: '#4caf50' }}>Activo</p>
                        </div>
                    </div>

                    <div className="historial-compras">
                        <h3>Historial de Compras</h3>
                        {loading ? (
                            <p className="loading-text">Cargando compras...</p>
                        ) : compras.length > 0 ? (
                            <div className="compras-lista">
                                {compras.map((compra) => (
                                    <div key={compra.id} className="compra-card">
                                        <div className="compra-header">
                                            <span className="compra-orden">Orden #{compra.id}</span>
                                            <span className="compra-fecha">{formatDate(compra.fecha)}</span>
                                        </div>
                                        <div className="compra-body">
                                            <div className="compra-detalle">
                                                <span>Total:</span>
                                                <strong>{formatPrice(compra.montoTotal)}</strong>
                                            </div>
                                            <div className="compra-detalle">
                                                <span>Método de pago:</span>
                                                <span className="compra-metodo">{compra.metodoPago}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-compras">Aún no has realizado ninguna compra.</p>
                        )}
                    </div>

                    <div className="perfil-actions">
                        <Link to="/editarPerfil" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                            Editar Información
                        </Link>
                        <Link to="/cambiarContrasena" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                            Cambiar Contraseña
                        </Link>
                        <button className="btn-danger" onClick={cerrarSesion}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
            <Footer hideFeatured={true} />
        </div>
    );
};

export default Perfil;
