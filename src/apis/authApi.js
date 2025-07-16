import axios from "axios";

const API_URL = "http://localhost:5000/api";

const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserProfileApi: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_URL}/auth/profile`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserProfileApi: async (userData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.put(`${API_URL}/auth/profile`, userData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendOtpApi: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOtpApi: async (email, otp) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  registerUserApi: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const { 
  getUserProfileApi, 
  updateUserProfileApi,
  sendOtpApi,
  verifyOtpApi,
  registerUserApi
} = authApi;

export default authApi;