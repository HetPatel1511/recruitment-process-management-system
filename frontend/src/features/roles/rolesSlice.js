import { createSlice } from "@reduxjs/toolkit";
import { getRoles } from "./rolesApi";

const initialState = {
  roles: [],
  status: 'idle',
  error: null,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload.data;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch roles';
      });
  },
});

export const { reset } = rolesSlice.actions;

export const selectRoles = (state) => state.roles.roles;
export const selectRolesStatus = (state) => state.roles.status;
export const selectRolesError = (state) => state.roles.error;

export default rolesSlice.reducer;
