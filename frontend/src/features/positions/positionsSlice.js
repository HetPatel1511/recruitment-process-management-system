import { createSlice } from "@reduxjs/toolkit";
import { getPositions, createPosition } from "./positionsApi";

const initialState = {
  positions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const positionSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
    reset: (state) => {
      state.positions = [];
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPositions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPositions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.positions = action.payload;
        state.error = null;
      })
      .addCase(getPositions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed';
      })
      
      .addCase(createPosition.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.positions = [...state.positions, action.payload];
        state.error = null;
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed. Please check your credentials.';
      });
  },
});

export const { reset, clearError } = positionSlice.actions;

export const selectPositions = (state) => state.positions.positions;
export const selectPositionStatus = (state) => state.positions.status;
export const selectPositionError = (state) => state.positions.error;

export default positionSlice.reducer;