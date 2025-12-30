import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { API_URLS } from '../../axios/api';
import { toast } from 'react-toastify';

// Helper function to handle successful authentication
const handleAuthSuccess = (response) => {
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  if (response.data.refreshToken) {
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
  return response.data;
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.REGISTER_USER, userData);
      return handleAuthSuccess(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'An error occurred during registration' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.LOGIN_USER, credentials);
      return handleAuthSuccess(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Invalid email or password' });
    }
  }
);

export const activateAccount = createAsyncThunk(
  'auth/activateAccount',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.ACTIVATE_ACCOUNT, data);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid token or password');
      return rejectWithValue(error.response?.data?.message || { message: 'Invalid token or password' });
    }
  }
);
