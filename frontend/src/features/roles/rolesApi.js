import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URLS } from "../../axios/api";
import axios from "../../axios";

export const getRoles = createAsyncThunk(
  "roles/getRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URLS.GET_ROLES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);
