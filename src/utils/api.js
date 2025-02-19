import axios from 'axios';
import config from '../config/config';

export const predictImages = async (images) => {
    try {
        const formData = new FormData();
        images.forEach(item => formData.append('files', item.file));

        const response = await axios.post(`${config.API.FULL_API_URL}/predict`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        if (response.data && response.data.predictions) {
            return response.data.predictions;
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('API Error:', error);
        throw {
            error: error.response?.data?.error || error.message || 'Request failed'
        };
    }
};

export const getHistory = async (page = 1) => {
    try {
        const response = await axios.get(`${config.API.FULL_API_URL}/history`, {
            params: {
                page,
                per_page: config.PAGINATION.DEFAULT_PAGE_SIZE
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw {
            error: error.response?.data?.error || error.message || 'Request failed'
        };
    }
};

export const getAuthenticatedImageUrl = (imagePath) => {
    return `${config.API.FULL_API_URL}/image/${imagePath}`;
};
