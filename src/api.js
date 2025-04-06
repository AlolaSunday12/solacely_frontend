import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // your backend
  withCredentials: true,            // sends cookies with every request
});

export default api;
