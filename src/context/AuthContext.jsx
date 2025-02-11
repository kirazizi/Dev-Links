import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUser(decodedToken.sub);
            }
            else{
                setUser(null);
            }
        }
        checkAuth();
    }, []);
    
    const login = (token) => {
        localStorage.setItem('authToken', token);
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.sub);
    };
    
    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}
