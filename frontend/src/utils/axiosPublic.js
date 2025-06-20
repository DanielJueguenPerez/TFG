import axios from 'axios';

const axiosPublic = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export default axiosPublic;