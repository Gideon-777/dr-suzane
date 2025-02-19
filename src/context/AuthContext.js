// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../utils/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await authApi.checkVerification();
            if (response.status === 'success') {
                setUser({
                    email: response.email,
                    username: response.profile?.username,
                    occupation: response.profile?.occupation,
                    is_verified: response.is_verified
                });
                setIsVerified(response.is_verified);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        setUser({
            email: userData.email,
            username: userData.username,
            occupation: userData.occupation,
            is_verified: userData.is_verified
        });
        setIsVerified(userData.is_verified);
    };

    const logout = async () => {
        try {
            await authApi.logout();
            setUser(null);
            setIsVerified(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isVerified,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
