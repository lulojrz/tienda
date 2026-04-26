import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductos } from '../context/ProductosContext';
import { useCart } from '../context/CartContext';
import './DetallesProductos.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DetallesProductos = () => {
    const { id } = useParams();
    const { obtenerProducto, producto } = useProductos();
    const { addToCart, toggleCart } = useCart();

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        obtenerProducto(id);
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (producto && producto.length > 0) {
            setSelectedColor(producto[0].color);
            setSelectedSize(producto[0].talla);
            setActiveImage(producto[0].imagen_especifica || producto[0].producto.imagen_principal);
        }
    }, [producto]);

    if (!producto || producto.length === 0) {
        return (
            <div className="product-detail-loading">
                <div className="spinner"></div>
                <p>Cargando producto...</p>
            </div>
        );
    }

    const baseData = producto[0].producto;
    const uniqueColors = [...new Set(producto.map(v => v.color))];

    const availableSizesForColor = producto
        .filter(v => v.color === selectedColor)
        .map(v => v.talla);

    const selectedVariant = producto.find(v => v.color === selectedColor && v.talla === selectedSize) ||
        producto.find(v => v.color === selectedColor);

    const priceToDisplay = selectedVariant && selectedVariant.precioEspecifico
        ? selectedVariant.precioEspecifico
        : baseData.precioBase;

    const handleColorClick = (color) => {
        setSelectedColor(color);
        const variant = producto.find(v => v.color === color);
        if (variant) {
            setActiveImage(variant.imagen_especifica || baseData.imagen_principal);
            const sizesForNewColor = producto.filter(v => v.color === color).map(v => v.talla);
            if (!sizesForNewColor.includes(selectedSize)) {
                setSelectedSize(sizesForNewColor[0]);
            }
        }
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        const productToAdd = {
            id: baseData.id, // el ID del producto general, o podríamos usar el de la variante
            nombre: baseData.nombre,
            precio: priceToDisplay,
            imagen: activeImage,
            color: selectedColor,
            talla: selectedSize,
            sku: selectedVariant.sku // si es necesario
        };

        addToCart(productToAdd);
        toggleCart();
    };

    return (
        <>
            <Navbar />
            <div className="product-detail-container container">
                <Link to="/productos" className="back-link">
                    &larr; Volver a productos
                </Link>

                <div className="product-detail-content">
                    <div className="product-detail-gallery">
                        <div className="main-image-container">
                            <img
                                src={activeImage}
                                alt={baseData.nombre}
                                className="main-image"
                            />
                        </div>
                        <div className="thumbnail-container">
                            {uniqueColors.map(color => {
                                const variant = producto.find(v => v.color === color);
                                return (
                                    <div
                                        key={color}
                                        className={`thumbnail ${selectedColor === color ? 'active' : ''}`}
                                        onClick={() => handleColorClick(color)}
                                    >
                                        <img src={variant.imagen_especifica || baseData.imagen_principal} alt={`${baseData.nombre} ${color}`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="product-detail-info">
                        <div className="product-brand-category">
                            <span className="brand-badge">{baseData.marca}</span>
                            <span className="category-text">{baseData.categoria ? baseData.categoria.nombre : ''}</span>
                        </div>

                        <h1 className="product-title-detail">{baseData.nombre}</h1>

                        <div className="product-price-large">
                            {formatPrice(priceToDisplay)}
                        </div>

                        <p className="product-description-text">
                            {baseData.descripcion}
                        </p>

                        <div className="variants-section">
                            <div className="variant-group">
                                <h3 className="variant-label">Color: <span className="variant-value">{selectedColor}</span></h3>
                                <div className="color-options">
                                    {uniqueColors.map(color => (
                                        <button
                                            key={color}
                                            className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                                            onClick={() => handleColorClick(color)}
                                            title={color}
                                        >
                                            <span className="color-name-display">{color}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="variant-group">
                                <h3 className="variant-label">Talle: <span className="variant-value">{selectedSize}</span></h3>
                                <div className="size-options">
                                    {availableSizesForColor.map(size => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                            onClick={() => handleSizeClick(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="stock-info">
                            {selectedVariant && selectedVariant.stock > 0 ? (
                                <span className="in-stock">✓ En stock ({selectedVariant.stock} disponibles)</span>
                            ) : (
                                <span className="out-of-stock">✗ Sin stock</span>
                            )}
                            {selectedVariant && selectedVariant.sku && (
                                <span className="sku-text">SKU: {selectedVariant.sku}</span>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button
                                className="btn-primary add-to-cart-btn"
                                disabled={!selectedVariant || selectedVariant.stock === 0}
                                onClick={handleAddToCart}
                            >
                                AGREGAR AL CARRITO
                            </button>
                        </div>

                        <div className="shipping-info">
                            <div className="info-item">
                                <span className="icon">🚚</span>
                                <p>Envío gratis a todo el país</p>
                            </div>
                            <div className="info-item">
                                <span className="icon">↩️</span>
                                <p>Devolución gratis dentro de los 30 días</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DetallesProductos;