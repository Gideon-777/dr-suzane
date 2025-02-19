// src/pages/Auth/VerifyEmail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/authApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Auth.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        let mounted = true;

        const verifyEmail = async () => {
            try {
                const response = await authApi.verifyEmail(token);
                if (mounted) {
                    setStatus('success');
                    setMessage(response.message);
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (error) {
                if (mounted) {
                    setStatus('error');
                    setMessage(error.error || 'Verification failed');
                }
            }
        };

        verifyEmail();

        return () => {
            mounted = false;
        };
    }, [token, navigate]);


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Email Verification</h2>
                {status === 'verifying' ? (
                    <div className="loading-container">
                        <LoadingSpinner size="medium" />
                        <p className="loading-text">{message}</p>
                    </div>
                ) : (
                    <div className={`message ${status}`}>
                        {message}
                    </div>)}
                {status === 'error' && (
                    <button
                        className="auth-button"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
