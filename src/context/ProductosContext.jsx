import { createContext, useContext, useState } from "react";


// Colocamos la URL de Railway fija directamente para asegurar la conexión
const API_URL = "https://mi-backend-java-production.up.railway.app";

const ProductosContext = createContext();
export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [portada, setPortada] = useState([]);
    const [producto, setProducto] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);


    const obtenerProductos = async () => {
        try {
            const response = await fetch(`${API_URL}/productos`);
            const data = await response.json();
            const filtrados = [];
            data.forEach(producto => {

                if (producto.is_active) {
                    filtrados.push(producto)
                }
                if (producto.is_active && producto.portada) {
                    setPortada(producto)

                }
            });
            setProductos(filtrados)



        } catch (error) {

        }

    }
    const obtenerProducto = async (id) => {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`);
            const data = await response.json();
            setProducto(data)
        } catch (error) {

        }

    }
    const filtrarProducto = (id) => {
        const producto = productos.find(producto => producto.id === id);
        setProductoSeleccionado(producto)
    }

    const obtenerIdProducto = async (id) => {
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data
        } catch (error) {

        }
    }

    return (
        <ProductosContext.Provider value={{ obtenerProductos, productos, portada, obtenerProducto, producto, filtrarProducto, productoSeleccionado, obtenerIdProducto }}>
            {children}
        </ProductosContext.Provider>
    )
}

export const useProductos = () => useContext(ProductosContext)
