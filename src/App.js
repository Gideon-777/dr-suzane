// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyEmail from './pages/Auth/VerifyEmail';
import History from './pages/History/History';
import Profile from './pages/Profile/Profile';
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';

import './styles/global.css';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

// Configure axios defaults
import axios from 'axios';
axios.defaults.withCredentials = true;

function App() {
    const [loading, setLoading] = React.useState(true);

    // Use useEffect to simulate loading state (you might want to remove this and use actual loading states)
    React.useEffect(() => {
        // Simulate loading state for 1 second
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthProvider>
            <div className="App">
                <ParticlesBackground />
                {loading ? (
                    <div className="loading-container">
                        <LoadingSpinner size="large" />
                        <p className="loading-text">Initializing Application...</p>
                    </div>
                ) : (
                    <div className="content-wrapper">
                        <Navbar />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/verify/:token" element={<VerifyEmail />} />
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <Home />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/history"
                                element={
                                    <PrivateRoute>
                                        <History />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />


                        </Routes>
                    </div>
                )}
            </div>
        </AuthProvider>
    );
}

export default App;
