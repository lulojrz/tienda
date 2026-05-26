import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import './InicioSesion.css';

const OlvidoContrasena = () => {
    const [identificador, setIdentificador] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!identificador) return;
        setIsLoading(true);

        let emailDestino = "";

        // Simple validación para saber si es un email
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);

        if (isEmail) {
            emailDestino = identificador;
        } else {
            // Es un usuario, hacer petición al backend
            try {
                // ATENCIÓN: Los navegadores web BLOQUEAN el envío de 'body' en peticiones GET.
                // Es una regla estricta de HTTP implementada en fetch() y XMLHttpRequest.
                // Por lo tanto, ESTA PETICIÓN SE ESTÁ ENVIANDO COMO POST.
                // Asegúrate de que en tu backend (ej. Spring Boot) tengas @PostMapping en vez de @GetMapping.
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clientes/email`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ usuario: identificador })
                });

                if (!response.ok) {

                    throw new Error(`Error ${response.status}: Asegúrate de que el backend soporte POST para esta ruta.`);
                }

                const textData = await response.text();

                try {
                    // Intentamos parsear por si retorna un JSON { "email": "..." }
                    const data = JSON.parse(textData);
                    emailDestino = data.email || data.correo || textData; 
                } catch (e) {
                    // Si falla el parseo, asumimos que retornó el email como texto plano
                    emailDestino = textData.trim();
                }

                if (!emailDestino || !emailDestino.includes('@')) {
                    throw new Error('El backend no retornó un email válido.');
                }
            } catch (error) {

                Swal.fire({
                    title: "Error",
                    text: "No se pudo obtener el correo del usuario. Revisa la consola para más detalles.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return; // Cortamos la ejecución si falla
            }
        }

        // Enviar el email con EmailJS usando el Service ID y Public Key de la tienda
        try {
            const userName = isEmail ? emailDestino.split('@')[0] : identificador;
            const resetLink = `${window.location.origin}/cambiarContrasena?email=${encodeURIComponent(emailDestino)}`;

            const templateParams = {
                user_email: emailDestino, // Probablemente usado para el destinatario en EmailJS
                email: emailDestino,
                user_name: userName,
                reset_link: resetLink
            };

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID, 
                import.meta.env.VITE_EMAILJS_FORGOT_PWD_TEMPLATE_ID, 
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY 
            );

            Swal.fire({
                title: "Solicitud procesada",
                text: `Se han enviado las instrucciones al correo: ${emailDestino}`,
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                navigate('/inicioSesion');
            });
        } catch (emailError) {

            Swal.fire({
                title: "Error",
                text: "Hubo un problema al intentar enviar el correo. Por favor, intenta de nuevo.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setIsLoading(false);
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

                        <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span> Enviando...
                                </>
                            ) : (
                                "Enviar Instrucciones"
                            )}
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
