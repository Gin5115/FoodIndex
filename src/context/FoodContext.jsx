import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const FoodContext = createContext();

export const useFood = () => {
    return useContext(FoodContext);
};

export const FoodProvider = ({ children }) => {
    // Initialize cart from localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cartItems');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            return [];
        }
    });

    // Sync cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Derived state
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cartItems.reduce((total, item) => {
        const price = item.salePrice || item.currentPrice || item.price || 0;
        return total + (price * item.quantity);
    }, 0);

    // Actions
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id || item._id === product._id);
            if (existingItem) {
                toast.success(`Added another ${product.name}!`, { icon: '🛒' });
                return prevItems.map(item =>
                    (item.id === product.id || item._id === product._id)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                toast.success(`${product.name} added to cart!`, { icon: '🛒' });
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => (item.id || item._id) !== id));
        toast.success('Item removed from cart', { icon: '🗑️' });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                (item.id || item._id) === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    // Place order — POST to API
    const placeOrder = async (token) => {
        try {
            const orderItems = cartItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.salePrice || item.currentPrice || item.price || 0,
                product: item._id || item.id,
            }));

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderItems,
                    totalPrice: cartTotal,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                clearCart();
                toast.success('Order placed successfully! 🎉');
                return { success: true, order: data };
            } else {
                toast.error(data.message || 'Failed to place order');
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            return { success: false, message: error.message };
        }
    };

    // Location State
    const [userLocation, setUserLocation] = useState(() => {
        try {
            const storedLoc = localStorage.getItem('userLocation');
            return storedLoc ? JSON.parse(storedLoc) : null;
        } catch (error) {
            return null;
        }
    });

    const detectLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                toast.error('Geolocation is not supported by your browser');
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(loc);
                    localStorage.setItem('userLocation', JSON.stringify(loc));
                    toast.success('Location detected! Showing deals near you.');
                    resolve(loc);
                },
                (error) => {
                    console.error('Location detection failed:', error);
                    toast.error('Unable to retrieve location');
                    reject(error);
                }
            );
        });
    };

    const value = {
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        userLocation,
        detectLocation
    };

    return (
        <FoodContext.Provider value={value}>
            {children}
        </FoodContext.Provider>
    );
};
