import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { API_URLS } from "../../axios/api";

export const getPositionApplicants = createAsyncThunk(
  'positions/getPositionApplicants',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        API_URLS.GET_POSITION_APPLICANTS.replace(':positionId', data.positionId)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch applicants');
    }
  }
);
