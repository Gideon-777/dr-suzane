import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../utils/authApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Profile.css';

const Profile = () => {
    const { user, checkAuth } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        occupation: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editMode, setEditMode] = useState({
        username: false,
        occupation: false
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                occupation: user.occupation || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear any previous messages
        setMessage({ type: '', text: '' });
    };

    const toggleEdit = (field) => {
        setEditMode(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
        // Reset field value if canceling edit
        if (editMode[field]) {
            setFormData(prev => ({
                ...prev,
                [field]: user[field] || ''
            }));
        }
    };

    const handleSubmit = async (field) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (field === 'username') {
                await authApi.updateUsername(formData.username);
            } else if (field === 'occupation') {
                await authApi.updateOccupation(formData.occupation);
            }

            await checkAuth(); // Refresh user data
            setMessage({
                type: 'success',
                text: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
            });
            setEditMode(prev => ({
                ...prev,
                [field]: false
            }));
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.error || `Failed to update ${field}`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profile Settings</h2>
                <p>Manage your account information</p>
            </div>

            <div className="profile-form">
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-action-wrapper">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!editMode.username || loading}
                            className={editMode.username ? 'editing' : ''}
                        />
                        {editMode.username ? (
                            <div className="action-buttons">
                                <button
                                    onClick={() => handleSubmit('username')}
                                    disabled={loading}
                                    className="save-btn"
                                >
                                    {loading ? <LoadingSpinner size="small" /> : 'Save'}
                                </button>
                                <button
                                    onClick={() => toggleEdit('username')}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => toggleEdit('username')}
                                className="edit-btn"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className="readonly"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="occupation">Occupation</label>
                    <div className="input-action-wrapper">
                        <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            disabled={!editMode.occupation || loading}
                            className={editMode.occupation ? 'editing' : ''}
                        />
                        {editMode.occupation ? (
                            <div className="action-buttons">
                                <button
                                    onClick={() => handleSubmit('occupation')}
                                    disabled={loading}
                                    className="save-btn"
                                >
                                    {loading ? <LoadingSpinner size="small" /> : 'Save'}
                                </button>
                                <button
                                    onClick={() => toggleEdit('occupation')}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => toggleEdit('occupation')}
                                className="edit-btn"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
