import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../utils/authApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address' });
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.forgotPassword(email);
            setMessage({
                type: 'success',
                text: response.message || 'Password reset instructions sent to your email'
            });
            setEmail('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.error || 'Failed to process request'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive reset instructions</p>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="button-content">
                                <LoadingSpinner size="small" />
                                <span>Sending...</span>
                            </div>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
