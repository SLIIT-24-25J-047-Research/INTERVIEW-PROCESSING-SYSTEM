// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


interface User {
    id: string;  
    email: string;
    role: string;
}

interface DecodedToken {
    id: string;  
    email: string;
    role: string;
    exp: number;
    iat: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, role: string, email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const decodeAndValidateToken = (token: string): DecodedToken | null => {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp < currentTime) {
                return null;
            }
            
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const decoded = decodeAndValidateToken(token);
            
            if (decoded) {
                setUser({
                    id: decoded.id,     
                    email: decoded.email,
                    role: decoded.role
                });
            } else {
                localStorage.clear();
            }
        }
        
        setLoading(false);
    }, []);

    const login = (token: string, role: string, email: string) => {
        const decoded = decodeAndValidateToken(token);
        
        if (!decoded) {
            throw new Error('Invalid token');
        }

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        localStorage.setItem('authToken', token);

        setUser({
            id: decoded.id,         
            email: decoded.email,
            role: decoded.role
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};