import axios from 'axios';

export const api = axios.create({
  baseURL: '',
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
