import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const register = (email, password, role) => {
    return axios.post(`${API_URL}/register`, { email, password, role });
};

// CHANGED: 'login' function now accepts and sends the role
const login = async (email, password, role) => {
    const response = await axios.post(`${API_URL}/login`, { email, password, role });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;