// src/pages/Auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../utils/authApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // Clear messages when inputs change
    useEffect(() => {
        setError('');
        setMessage('');
    }, [email, password]);

    const validateForm = () => {
        // Email validation
        if (!email) {
            setError('Please enter your email address');
            return false;
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Password validation
        if (!password) {
            setError('Please enter your password');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setMessage('Signing you in...');

        try {
            const response = await authApi.login(email, password);

            if (response.status === 'success') {
                setMessage('Login successful! Redirecting...');
                await login({
                    email,
                    username: response.profile?.username,
                    occupation: response.profile?.occupation,
                    is_verified: response.is_verified
                });
                navigate('/');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            console.log(err.error);
            const errorMessage = err.error || 'Unable to sign in. Please try again.';

            if (errorMessage?.includes('verify')) {
                setError('Please verify your email before logging in. Check your inbox for the verification link.');
            } else if (errorMessage?.includes('credentials')) {
                setError('Invalid email or password. Please try again.');
            } else if (errorMessage?.includes('many attempts')) {
                setError('Too many login attempts. Please try again later.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="auth-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account to continue</p>
                </div>

                <AnimatePresence>
                    {(error || message) && (
                        <motion.div
                            className={`message ${error ? 'error' : 'success'}`}
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                        >
                            <i className={`fas ${error ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                            <p>{error || message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className={error && !email ? 'error' : ''}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className={error && !password ? 'error' : ''}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="button-content">
                                <LoadingSpinner size="small"/>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <div className="button-content">
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Sign In</span>
                            </div>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    <p>Did you <Link to="/forgot-password">Forgot your Password?</Link></p>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
