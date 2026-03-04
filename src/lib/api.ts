import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8090/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            // Don't redirect if we're already on the login page to avoid infinite refresh
            // and allowing the Login component to show the error message.
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
