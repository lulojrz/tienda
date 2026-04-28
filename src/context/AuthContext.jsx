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
                const data = await response.json();

                Swal.fire({
                    title: "Inicio de sesión exitoso",
                    text: "Has iniciado sesión correctamente",
                    theme: "dark",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                localStorage.setItem("isLogin", true);
                localStorage.setItem("token", data.token);
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
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            // Solo si el usuario hizo clic en "Aceptar"
            if (result.isConfirmed) {
                // 1. Borramos TODO lo relacionado a la sesión
                localStorage.removeItem("isLogin");
                localStorage.setItem("isLogin", "false"); // Opcional, mejor borrarlo
                localStorage.removeItem("user");
                localStorage.removeItem("token"); // <--- ¡IMPORTANTÍSIMO BORRAR EL TOKEN!

                // 2. Limpiamos los estados de React
                setIsLogin(false);
                setUser(null);

                // 3. Redirigimos al inicio
                navigate("/");

                // Opcional: Una alerta chiquita de que salió bien
                Swal.fire("¡Sesión cerrada!", "Has salido de tu cuenta correctamente.", "success");
            }
        });
    };

    return (
        <AuthContext.Provider value={{ iniciarSesion, cerrarSesion, isLogin, user, setIsLogin, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
