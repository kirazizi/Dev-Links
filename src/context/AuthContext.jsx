import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        image: "",
      });

      useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setUser(decodedToken.sub);
                } catch (error) {
                    localStorage.removeItem('authToken');
                    setUser(null);
                }
            }
            setLoading(false);
        };
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
        <AuthContext.Provider value={{ 
            user, 
            loading,
            links, 
            setLinks, 
            profile, 
            setProfile, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}
