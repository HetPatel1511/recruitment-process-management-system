import { createSlice } from "@reduxjs/toolkit";
import { getPositionApplicants } from "./positionApplicantsApi";

const initialState = {
  positionApplicants: null,
  status: 'idle',
  error: null,
};

const positionApplicantsSlice = createSlice({
  name: "positionApplicants",
  initialState,
  reducers: {
    reset: (state) => {
      state.positionApplicants = null;
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPositionApplicants.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPositionApplicants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.positionApplicants = action.payload.data;
        state.error = null;
      })
      .addCase(getPositionApplicants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch applicants';
      });
  },
});

export const { reset, clearError } = positionApplicantsSlice.actions;

export const selectPositionApplicants = (state) => state.positionApplicants.positionApplicants;
export const selectPositionApplicantsStatus = (state) => state.positionApplicants.status;
export const selectPositionApplicantsError = (state) => state.positionApplicants.error;

export default positionApplicantsSlice.reducer;
