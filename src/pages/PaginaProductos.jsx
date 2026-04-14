import React, { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useProductos } from '../context/ProductosContext'
import ProductCard from '../components/ProductCard'
import './PaginaProductos.css'

const PaginaProductos = () => {
    const { obtenerProductos, productos } = useProductos();
    const [cargando, setCargando] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [filtroGenero, setFiltroGenero] = useState('Todos');
    const [filtroPrecio, setFiltroPrecio] = useState(0);

    useEffect(() => {
        if (productos.length > 0) {
            setFiltroPrecio(Math.max(...productos.map(p => p.precioBase || 0)));
        }
    }, [productos]);

    const precioMaximoGlobal = useMemo(() => {
        if (productos.length === 0) return 10000;
        return Math.max(...productos.map(p => p.precioBase || 0));
    }, [productos]);
    const categorias = useMemo(() => {
        return ['Todas', ...new Set(productos.map(p => p.categoria?.nombre).filter(Boolean))];
    }, [productos]);

    const generos = useMemo(() => {
        return ['Todos', ...new Set(productos.map(p => p.categoria?.genero).filter(Boolean))];
    }, [productos]);

    const productosFiltrados = useMemo(() => {
        return productos.filter(p => {
            const matchCategoria = filtroCategoria === 'Todas' || p.categoria?.nombre === filtroCategoria;
            const matchGenero = filtroGenero === 'Todos' || p.categoria?.genero === filtroGenero;
            const matchPrecio = (p.precioBase || 0) <= filtroPrecio;
            return matchCategoria && matchGenero && matchPrecio;
        });
    }, [productos, filtroCategoria, filtroGenero, filtroPrecio]);

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

                {!cargando && (
                    <div className="filters-section">
                        <div className="filter-group">
                            <label htmlFor="genero">Género:</label>
                            <select
                                id="genero"
                                value={filtroGenero}
                                onChange={(e) => setFiltroGenero(e.target.value)}
                            >
                                {generos.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="categoria">Categoría:</label>
                            <select
                                id="categoria"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                {categorias.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group filter-price">
                            <label htmlFor="precio">Precio Máx: ${filtroPrecio.toLocaleString()}</label>
                            <input
                                type="range"
                                id="precio"
                                min="0"
                                max={precioMaximoGlobal}
                                step="1000"
                                value={filtroPrecio}
                                onChange={(e) => setFiltroPrecio(Number(e.target.value))}
                                className="range-slider"
                            />
                        </div>
                    </div>
                )}

                {cargando ? (
                    <div className="loading-spinner">CARGANDO PRODUCTOS...</div>
                ) : (
                    <div className="productos-grid-full">
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
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