import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { API_URLS } from '../../axios/api';

export const getPositions = createAsyncThunk(
  'positions/getPositions',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URLS.GET_POSITIONS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'An error occurred during getting positions' });
    }
  }
);

export const createPosition = createAsyncThunk(
  'positions/createPosition',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.CREATE_POSITION, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Invalid input' });
    }
  }
)

export const applyForPosition = createAsyncThunk(
  'positions/applyForPosition',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.APPLY_FOR_POSITION.replace(':id', data.id));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Invalid input' });
    }
  }
);

export const getSinglePosition = createAsyncThunk(
  'positions/getSinglePosition',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URLS.GET_SINGLE_POSITION.replace(':id', data.id));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Invalid input' });
    }
  }
);

export const updatePosition = createAsyncThunk(
  'positions/updatePosition',
  async (data, { rejectWithValue }) => {
    try {
      const requestBody = { ...data };
      delete requestBody.id;
      const response = await axios.put(API_URLS.UPDATE_POSITION.replace(':id', data.id), requestBody);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Invalid input' });
    }
  }
);
