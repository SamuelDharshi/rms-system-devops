// frontend/lib/axios.ts
import axios from 'axios';

/**
 * Pre-configured Axios instance for the Java Spring Boot backend.
 * No JWT — user ID is passed as a query parameter where needed.
 * Base URL points to localhost:8080 for local development.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — show errors clearly, no auto-redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let each page handle its own errors
    return Promise.reject(error);
  }
);

export default api;
