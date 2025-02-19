import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../utils/authApi';
import './EmailVerification.css';

const EmailVerification = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const handleResendVerification = async () => {
        if (cooldown) return;

        setLoading(true);
        try {
            const response = await authApi.resendVerification(user?.email || '');

            if (response?.status === 'success' || response?.message) {
                setMessage('Verification email sent successfully!');
                setCooldown(true);

                // Start countdown
                let count = 60;
                const timer = setInterval(() => {
                    count--;
                    setCountdown(count);
                    if (count === 0) {
                        setCooldown(false);
                        clearInterval(timer);
                    }
                }, 1000);
            } else {
                setMessage('Failed to send verification email. Please try again.');
            }
        } catch (error) {
            const errorMessage = error.error || 'Failed to send verification email. Please try again.';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verification-container">
            <div className="verification-card">
                <h2>Email Verification Required</h2>
                <p>Please verify your email address to access all features.</p>
                <p>A verification email has been sent to: <strong>{user?.email}</strong></p>

                {message && (
                    <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <button
                    className="resend-btn"
                    onClick={handleResendVerification}
                    disabled={loading || cooldown}
                >
                    {loading ? 'Sending...' :
                        cooldown ? `Resend available in ${countdown}s` :
                            'Resend Verification Email'}
                </button>
            </div>
        </div>
    );
};

export default EmailVerification;
