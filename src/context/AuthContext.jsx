import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Colocamos la URL de Railway fija directamente para asegurar la conexión
const API_URL = "https://backend-admin-production-fb26.up.railway.app";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(() => (sessionStorage.getItem("isLogin") || localStorage.getItem("isLogin")) === "true");
    const [user, setUser] = useState(() => sessionStorage.getItem("user") || localStorage.getItem("user") || null);
    const [id, setId] = useState(() => sessionStorage.getItem("id") || localStorage.getItem("id") || null);
    const navigate = useNavigate();

    const iniciarSesion = async (body, rememberMe = false) => {
        try {
            const response = await fetch(`${API_URL}/clientes/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();

                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem("id", data.id);
                storage.setItem("isLogin", "true");
                storage.setItem("token", data.token);
                storage.setItem("user", body.usuario);

                setId(data.id);
                setIsLogin(true);
                setUser(body.usuario);

                Swal.fire({
                    title: "Inicio de sesión exitoso",
                    text: "Has iniciado sesión correctamente",
                    theme: "dark",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

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

            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.",
                theme: "dark",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }

    const datosClientes = async (id) => {
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const response = await fetch(`${API_URL}/clientes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {

            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al intentar obtener los datos del cliente. Por favor, inténtalo más tarde.",
                theme: "dark",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }

    const venta = async (body) => {


        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const response = await fetch(`${API_URL}/confirmar/venta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorText = await response.text();

                throw new Error("No autorizado o error de servidor");
            }
            const data = await response.json();
            return data;
        } catch (error) {

            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al intentar confirmar la venta. Por favor, inténtalo más tarde.",
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
                localStorage.removeItem("id");
                localStorage.removeItem("isLogin");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                sessionStorage.removeItem("id");
                sessionStorage.removeItem("isLogin");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
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

    const editarUsuario = async (id, body) => {
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const response = await fetch(`${API_URL}/clientes/editar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                Swal.fire({
                    title: "Actualización exitosa",
                    text: "Tus datos han sido actualizados correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                return true;
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron actualizar los datos",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return false;
            }
        } catch (error) {

            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al intentar actualizar los datos.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
            return false;
        }
    };

    const verificarCredenciales = async (id, credenciales) => {
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const response = await fetch(`${API_URL}/clientes/verificar/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(credenciales)
            });

            if (response.ok) {
                return true;
            } else {
                Swal.fire({
                    title: "Verificación fallida",
                    text: "La contraseña actual no es correcta.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return false;
            }
        } catch (error) {

            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al verificar tus credenciales.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ iniciarSesion, cerrarSesion, isLogin, user, setIsLogin, setUser, datosClientes, id, setId, venta, editarUsuario, verificarCredenciales }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
