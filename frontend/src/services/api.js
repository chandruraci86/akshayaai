import axios from 'axios';

// Use the environment variable if present, fallback to localhost for local dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getBuckets = async () => {
    const response = await api.get('/buckets');
    return response.data;
};

export const updateBucketStrategy = async (bucketId, strategy) => {
    const response = await api.put(`/buckets/${bucketId}/strategy`, { strategy });
    return response.data;
};

export const getReorderDashboard = async () => {
    const response = await api.get('/reorder-dashboard');
    return response.data;
};

export default api;
