import { createSlice } from "@reduxjs/toolkit";
import { getPositions, createPosition, applyForPosition, getSinglePosition, updatePosition } from "./positionsApi";
import { toast } from 'react-toastify';

const initialState = {
  positions: [],
  singlePosition: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  appliedStatus: 'idle',
  appliedError: null,
  singlePositionStatus: 'idle',
  singlePositionError: null,
  updateStatus: 'idle',
  updateError: null,
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
      })

      // Get single position
      .addCase(getSinglePosition.pending, (state) => {
        state.singlePositionStatus = 'loading';
        state.singlePositionError = null;
      })
      .addCase(getSinglePosition.fulfilled, (state, action) => {
        state.singlePositionStatus = 'succeeded';
        state.singlePosition = action.payload.data;
        state.singlePositionError = null;
      })
      .addCase(getSinglePosition.rejected, (state, action) => {
        state.singlePositionStatus = 'failed';
        state.singlePositionError = action.payload?.message;
      })

      // Update position
      .addCase(updatePosition.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        // Update the single position if it matches
        if (state.singlePosition && state.singlePosition.id === action.payload.data.id) {
          state.singlePosition = action.payload.data;
        }
        
        // Update the position in the positions list if it exists
        const index = state.positions.findIndex(pos => pos.id === action.payload.data.id);
        if (index !== -1) {
          state.positions[index] = action.payload.data;
        }
        toast.success(action.payload.message || 'Position updated successfully');
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload?.message;
        toast.error(action.payload?.message || 'Failed to update position');
      });
  },
});

export const { reset, clearError } = positionSlice.actions;

// Positions selector
export const selectPositions = (state) => state.positions.positions;
export const selectPositionStatus = (state) => state.positions.status;
export const selectPositionError = (state) => state.positions.error;

// Single position selector
export const selectSinglePosition = (state) => state.positions.singlePosition;
export const selectSinglePositionStatus = (state) => state.positions.singlePositionStatus;
export const selectSinglePositionError = (state) => state.positions.singlePositionError;

// Update position selector
export const selectUpdateStatus = (state) => state.positions.updateStatus;
export const selectUpdateError = (state) => state.positions.updateError;

export default positionSlice.reducer;