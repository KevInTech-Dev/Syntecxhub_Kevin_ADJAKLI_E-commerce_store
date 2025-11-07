import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour logger les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('Envoi requête:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Erreur requête:', error);
    return Promise.reject(error);
  }
)

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si l'erreur est due à un problème d'authentification
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default api
