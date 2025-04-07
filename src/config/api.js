// src/config/api.js
import axios from "axios";

// Base API URL
const BASE_URL = "http://localhost:9000";

// API endpoints
const API = {
  auth: {
    base: `${BASE_URL}/api/auth`,
    register: `${BASE_URL}/api/auth/register`,
    login: `${BASE_URL}/api/auth/login`,
    refreshToken: `${BASE_URL}/api/auth/refresh-token`,
    logout: `${BASE_URL}/api/auth/logout`,
  },
  tables: {
    base: `${BASE_URL}/api/tables`,
    getById: (id) => `${BASE_URL}/api/tables/${id}`,
    create: `${BASE_URL}/api/tables`,
    update: (id) => `${BASE_URL}/api/tables/${id}`,
    delete: (id) => `${BASE_URL}/api/tables/${id}`,
  },
};

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";

// Setup axios interceptor for authentication
const setupAxiosInterceptors = (accessToken) => {
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export { API, setupAxiosInterceptors };
