import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EditarPerfil.css';

const EditarPerfil = () => {
    const { id, isLogin, datosClientes, editarUsuario } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        usuario: ''
    });
    const [clienteOriginal, setClienteOriginal] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    setFormData({
                        nombre: clientInfo.nombre || '',
                        apellido: clientInfo.apellido || '',
                        usuario: clientInfo.usuario || ''
                    });
                }
            }
            setLoading(false);
        };
        
        fetchData();
    }, [id, isLogin, navigate, datosClientes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = id || sessionStorage.getItem('id') || localStorage.getItem('id');
        
        // Enviar toda la información del cliente, pisando solo los datos que se pueden editar
        const bodyToSend = { 
            ...clienteOriginal, 
            ...formData 
        };

        const success = await editarUsuario(userId, bodyToSend);
        if (success) {
            navigate('/perfil');
        }
    };

    if (loading) {
        return (
            <div className="editar-perfil-container">
                <Navbar />
                <div className="editar-perfil-content">
                    <p style={{ color: '#fff' }}>Cargando datos...</p>
                </div>
                <Footer hideFeatured={true} />
            </div>
        );
    }

    return (
        <div className="editar-perfil-container">
            <Navbar />
            <div className="editar-perfil-content">
                <div className="editar-perfil-box">
                    <h2>Editar Información</h2>
                    <form onSubmit={handleSubmit} className="editar-form">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="usuario">Usuario</label>
                            <input type="text" id="usuario" name="usuario" value={formData.usuario} onChange={handleChange} required />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/perfil')}>Cancelar</button>
                            <button type="submit" className="btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer hideFeatured={true} />
        </div>
    );
};

export default EditarPerfil;
