import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(() => localStorage.getItem("isLogin") === "true");
    const [user, setUser] = useState(() => localStorage.getItem("user") || null);
    const navigate = useNavigate();

    const iniciarSesion = async (body) => {
        try {
            const response = await fetch('http://localhost:8080/clientes/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                console.log("buen inicio");
                localStorage.setItem("isLogin", true);
                localStorage.setItem("user", body.usuario);
                setIsLogin(true);
                setUser(body.usuario);
                alert("Inicio de sesión exitoso");
                navigate("/");
            } else {
                console.error("credenciales incorrectas");
                alert("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.");
        }
    }

    const cerrarSesion = () => {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("user");
        setIsLogin(false);
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ iniciarSesion, cerrarSesion, isLogin, user, setIsLogin, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
