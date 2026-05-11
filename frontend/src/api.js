import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] ✓ Token attached to ${config.method.toUpperCase()} ${config.url}`);
    } else {
      console.warn(`[API] ✗ No token for ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 / 422 by logging details first, then redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;
      console.error(`[API ERROR] ${config.method.toUpperCase()} ${config.url} → ${status}`);
      console.error('Response data:', data);
      
      // If it's 401 (Unauthorized) or 422 (Unprocessable Entity), log and then redirect
      if (status === 401 || status === 422) {
        console.error('[AUTH] Token invalid or missing. Clearing localStorage and redirecting to login.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('[API ERROR] No response received:', error.request);
    } else {
      console.error('[API ERROR]', error.message);
    }
    return Promise.reject(error);
  }
);

export const signup = (data) => API.post('/signup', data);
export const login = (data) => API.post('/login', data);
export const predict = (data) => API.post('/predict', data);
export const getMyPredictions = () => API.get('/my_predictions');
export const getFixtures = () => API.get('/fixtures');
export const getTeamStats = () => API.get('/team_stats');
export const getTeamDetail = (teamName) => API.get(`/team_detail?name=${teamName}`);
export const getH2H = (teamA, teamB) => API.get(`/h2h?teamA=${teamA}&teamB=${teamB}`);
export const getHeadToHead = (teamA, teamB) => API.get(`/h2h?teamA=${teamA}&teamB=${teamB}`);