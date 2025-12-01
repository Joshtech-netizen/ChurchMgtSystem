import axios from 'axios';

const api = axios.create({
    // CHANGE THIS if your Postman URL was different
    baseURL: 'http://localhost/church-system/backend/api', 
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;