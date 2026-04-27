import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
                Swal.fire({
                    title: "Inicio de sesión exitoso",
                    text: "Has iniciado sesión correctamente",
                    theme: "dark",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                localStorage.setItem("isLogin", true);
                localStorage.setItem("user", body.usuario);
                setIsLogin(true);
                setUser(body.usuario);
                navigate("/");
            } else {
                Swal.fire({
                    title: "Inicio de sesión fallido",
                    text: "Usuario o contraseña incorrectos",
                    theme: "dark",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.",
                theme: "dark",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }

    const cerrarSesion = () => {
        Swal.fire({
            title: "Cerrar sesión",
            text: "¿Estás seguro de que deseas cerrar sesión?",
            theme: "dark",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar"
        });

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
