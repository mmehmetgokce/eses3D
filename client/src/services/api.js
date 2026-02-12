import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Token varsa her isteğe ekle
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('eses3d-admin-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('eses3d-admin-token');
            // Admin sayfasındaysak login'e yönlendir
            if (window.location.pathname.startsWith('/admin') &&
                window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (slug) => api.get(`/products/category/${slug}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const addProductImages = (id, formData) =>
    api.post(`/products/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
export const deleteProductImage = (productId, imageId) =>
    api.delete(`/products/${productId}/images/${imageId}`);

// Categories
export const getCategories = () => api.get('/categories');
export const getCategoryBySlug = (slug) => api.get(`/categories/${slug}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Requests
export const createRequest = (data) => api.post('/requests', data);
export const getRequestByRequestId = (requestId) => api.get(`/requests/${requestId}`);
export const getAllRequests = (params) => api.get('/requests', { params });
export const updateRequestStatus = (id, status) => api.put(`/requests/${id}/status`, { status });
export const deleteRequest = (id) => api.delete(`/requests/${id}`);

// Admin
export const loginAdmin = (data) => api.post('/admin/login', data);
export const setupAdmin = (data) => api.post('/admin/setup', data);
export const getAdminProfile = () => api.get('/admin/me');
export const getDashboardStats = () => api.get('/admin/stats');

// Upload
export const uploadImage = (formData) =>
    api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
export const uploadMultipleImages = (formData) =>
    api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
export const deleteImage = (publicId) => api.delete(`/upload/${publicId}`);

export default api;
