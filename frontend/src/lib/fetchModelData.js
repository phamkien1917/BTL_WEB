import axios from 'axios';

export const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await axios.get(`http://localhost:3001${endpoint}`, {
      ...options,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'API request failed');
  }
};

export const postData = async (endpoint, data, options = {}) => {
  try {
    const response = await axios.post(`http://localhost:3001${endpoint}`, data, {
      ...options,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'API request failed');
  }
};