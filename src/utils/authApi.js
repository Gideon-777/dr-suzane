import axios from 'axios';
import config from '../config/config';

axios.defaults.withCredentials = true;

export const authApi = {
    signup: async (email, password, username, occupation) => {
        try {
            const response = await axios.post(`${config.API.FULL_AUTH_URL}/signup`, {
                email,
                password,
                username,
                occupation
            });
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    login: async (email, password) => {
        try {
            const response = await axios.post(`${config.API.FULL_AUTH_URL}/login`, {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    verifyEmail: async (token) => {
        try {
            const response = await axios.get(`${config.API.FULL_AUTH_URL}/verify/${token}`);
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    resendVerification: async (email) => {
        try {
            const response = await axios.post(`${config.API.FULL_AUTH_URL}/resend-verification`, {
                email
            });
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    checkVerification: async () => {
        try {
            const response = await axios.get(`${config.API.FULL_AUTH_URL}/verification-status`);
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    logout: async () => {
        try {
            const response = await axios.post(`${config.API.FULL_AUTH_URL}/logout`);
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    updateUsername: async (username) => {
        try {
            // Fix: Add the full API URL path
            const response = await axios.put(`${config.API.FULL_AUTH_URL}/update-username`, {
                username
            });
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    updateOccupation: async (occupation) => {
        try {
            // Fix: Add the full API URL path
            const response = await axios.put(`${config.API.FULL_AUTH_URL}/update-occupation`, {
                occupation
            });
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${config.API.FULL_AUTH_URL}/forgot-password`, {
                email
            });
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },

    resetPassword: async (token, password) => {
        try {
            const response = await axios.post(
                `${config.API.FULL_AUTH_URL}/reset-password/${token}`,
                { password }
            );
            return response.data;
        } catch (error) {
            throw {
                error: error.response?.data?.error || error.message || 'Request failed'
            };
        }
    },
};
