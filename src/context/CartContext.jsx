import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Inicializar el carrito desde el localStorage o como un arreglo vacío
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem("cartItems");
        return localData ? JSON.parse(localData) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Guardar en localStorage cada vez que cartItems cambie
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Calcular el total
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    // Calcular la cantidad total de artículos
    const getItemCount = () => {
        return cartItems.reduce((count, item) => count + item.cantidad, 0);
    };

    const addToCart = (productToAdd) => {
        setCartItems((prevItems) => {
            // Un producto en el carrito se identifica por su ID y opcionalmente su color/talle si es una variante
            const existingItemIndex = prevItems.findIndex(
                item => item.id === productToAdd.id && 
                        item.color === productToAdd.color && 
                        item.talla === productToAdd.talla
            );

            if (existingItemIndex !== -1) {
                // Si ya existe, incrementar la cantidad
                const newItems = [...prevItems];
                newItems[existingItemIndex].cantidad += 1;
                return newItems;
            } else {
                // Si no existe, agregarlo con cantidad 1
                return [...prevItems, { ...productToAdd, cantidad: 1 }];
            }
        });
        
        // Opcional: abrir el carrito automáticamente al agregar un producto
        // setIsCartOpen(true);
    };

    const removeFromCart = (productId, color, talla) => {
        setCartItems((prevItems) => 
            prevItems.filter(item => 
                !(item.id === productId && item.color === color && item.talla === talla)
            )
        );
    };

    const updateQuantity = (productId, color, talla, delta) => {
        setCartItems((prevItems) => {
            return prevItems.map(item => {
                if (item.id === productId && item.color === color && item.talla === talla) {
                    const newQuantity = item.cantidad + delta;
                    // Asegurar que la cantidad no sea menor que 1
                    return { ...item, cantidad: newQuantity > 0 ? newQuantity : 1 };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider 
            value={{ 
                cartItems, 
                addToCart, 
                removeFromCart, 
                updateQuantity, 
                clearCart, 
                getCartTotal,
                getItemCount,
                isCartOpen,
                toggleCart,
                closeCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
