import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  search: (query) => api.get(`/api/products?search=${query}`),
};

export const orderService = {
  create: (order) => api.post('/api/orders', order),
  getByUserId: (userId) => api.get(`/api/orders?userId=${userId}`),
};

export const userService = {
  register: (user) => api.post('/api/users/register', user),
  login: (credentials) => api.post('/api/users/login', credentials),
};
