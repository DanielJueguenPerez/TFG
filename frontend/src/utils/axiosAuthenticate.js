import axios from 'axios';

const axiosAuthenticate = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

axiosAuthenticate.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default axiosAuthenticate;