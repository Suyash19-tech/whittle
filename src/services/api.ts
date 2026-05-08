import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '@/constants';

/**
 * API Service
 * Centralized HTTP client for all API requests
 * Handles authentication, error handling, and request/response interceptors
 */

class APIService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.baseUrl,
            timeout: API_CONFIG.timeout,
        });

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token if available
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle common errors
                if (error.response?.status === 401) {
                    // Handle unauthorized
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Generic GET request
     */
    async get<T>(url: string, config = {}) {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    /**
     * Generic POST request
     */
    async post<T>(url: string, data?: any, config = {}) {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    /**
     * Generic PUT request
     */
    async put<T>(url: string, data?: any, config = {}) {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    /**
     * Generic DELETE request
     */
    async delete<T>(url: string, config = {}) {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiService = new APIService();
