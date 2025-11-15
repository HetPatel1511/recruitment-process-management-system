import { createSlice } from "@reduxjs/toolkit";
import { getPositions, createPosition, applyForPosition } from "./positionsApi";
import { toast } from 'react-toastify';

const initialState = {
  positions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  appliedStatus: 'idle',
  appliedError: null,
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
      // Get positions
      .addCase(getPositions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPositions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.positions = action.payload.data;
        state.error = null;
      })
      .addCase(getPositions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      
      // Create position
      .addCase(createPosition.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.positions = [...state.positions, action.payload.data];
        state.error = null;
        toast.success(action.payload.message);
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message;
        toast.error(action.payload?.message);
      })
      
      // Apply for position
      .addCase(applyForPosition.pending, (state) => {
        state.appliedStatus = 'loading';
        state.appliedError = null;
      })
      .addCase(applyForPosition.fulfilled, (state, action) => {
        state.appliedStatus = 'succeeded';
        toast.success(action.payload.message);
      })
      .addCase(applyForPosition.rejected, (state, action) => {
        state.appliedStatus = 'failed';
        const errorMessage = action.payload?.message || 'Failed to submit application';
        state.appliedError = errorMessage;
        toast.error(errorMessage);
      });
  },
});

export const { reset, clearError } = positionSlice.actions;

export const selectPositions = (state) => state.positions.positions;
export const selectPositionStatus = (state) => state.positions.status;
export const selectPositionError = (state) => state.positions.error;

export default positionSlice.reducer;