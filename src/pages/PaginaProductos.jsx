import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useProductos } from '../context/ProductosContext'
import ProductCard from '../components/ProductCard'
import './PaginaProductos.css'

const PaginaProductos = () => {
    const { obtenerProductos, productos } = useProductos();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarData = async () => {
            await obtenerProductos();
            setCargando(false);
        }
        cargarData();

    }, []);

    return (
        <>
            <Navbar />
            <main className="productos-page container">
                <div className="page-header">
                    <h1 className="section-title">NUESTROS PRODUCTOS</h1>
                    <p className="page-subtitle">Explora nuestra colección completa de componentes y artículos.</p>
                </div>

                {cargando ? (
                    <div className="loading-spinner">CARGANDO PRODUCTOS...</div>
                ) : (
                    <div className="productos-grid-full">
                        {productos.length > 0 ? (
                            productos.map((producto) => (
                                <ProductCard key={producto.id} producto={producto} />
                            ))
                        ) : (
                            <p className="no-products">No se encontraron productos en la base de datos.</p>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}

export default PaginaProductos;