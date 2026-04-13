import { createContext, useContext, useState } from "react";


const ProductosContext = createContext();
export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [portada, setPortada] = useState([]);
    const [producto, setProducto] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);


    const obtenerProductos = async () => {
        try {
            const response = await fetch('http://localhost:8080/productos');
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
            console.error('Error al obtener productos:', error);

        }

    }
    const obtenerProducto = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/productos/${id}`);
            const data = await response.json();
            setProducto(data)
        } catch (error) {
            console.error('Error al obtener producto:', error);
        }

    }
    const filtrarProducto = (id) => {
        const producto = productos.find(producto => producto.id === id);
        setProductoSeleccionado(producto)
    }


    return (
        <ProductosContext.Provider value={{ obtenerProductos, productos, portada, obtenerProducto, producto, filtrarProducto, productoSeleccionado }}>
            {children}
        </ProductosContext.Provider>
    )
}

export const useProductos = () => useContext(ProductosContext)