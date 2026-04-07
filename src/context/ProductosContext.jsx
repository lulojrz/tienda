import { createContext, useContext, useState } from "react";


const ProductosContext = createContext();
export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);


    const obtenerProductos = async () => {
        try {
            const response = await fetch('http://localhost:8080/productos');
            const data = await response.json();
            setProductos(data);
            console.log(data)
        } catch (error) {
            console.error('Error al obtener productos:', error);

        }

    }


    return (
        <ProductosContext.Provider value={{ obtenerProductos, productos }}>
            {children}
        </ProductosContext.Provider>
    )
}

export const useProductos = () => useContext(ProductosContext)