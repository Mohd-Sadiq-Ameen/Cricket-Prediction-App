import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to every request if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    console.log(`Making request to ${config.url}`, config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = (data) => API.post('/signup', data);
export const login = (data) => API.post('/login', data);
export const predict = (data) => API.post('/predict', data);
export const getMyPredictions = () => API.get('/my_predictions');
export const getFixtures = () => API.get('/fixtures');
export const getTeamStats = () => API.get('/team_stats');

// Optional: add head-to-head stats
export const getTeamDetail = (teamName) => API.get(`/team_detail?name=${teamName}`);
export const getH2H = (teamA, teamB) => API.get(`/h2h?teamA=${teamA}&teamB=${teamB}`);
export const getHeadToHead = (teamA, teamB) => API.get(`/h2h?teamA=${teamA}&teamB=${teamB}`);