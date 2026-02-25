import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage synchronously to avoid flicker
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('userInfo');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            return null;
        }
    });
    const [loading, setLoading] = useState(false); // No longer loading initially
    const [error, setError] = useState(null);

    // Login
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                setError(data.message || 'Login failed');
                return { success: false, message: data.message };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Register
    const register = async (name, email, password, role = 'user', sellerData = {}) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                name,
                email,
                password,
                role,
                ...sellerData
            };

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                setError(data.message || 'Registration failed');
                return { success: false, message: data.message };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
