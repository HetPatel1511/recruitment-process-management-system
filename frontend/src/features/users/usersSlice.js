import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getSingleUser, getUsers, updateUser } from "./usersApi";

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  singleUser: null,
  singleUserStatus: 'idle',
  singleUserError: null,
  updateStatus: 'idle',
  updateError: null,
}

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.singleUser = null;
      state.singleUserStatus = 'idle';
      state.singleUserError = null;
      state.updateStatus = 'idle';
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getUsers.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(getUsers.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.data;
      state.error = null;
    })
    .addCase(getUsers.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
    .addCase(getSingleUser.pending, (state) => {
      state.singleUserStatus = 'loading';
      state.singleUserError = null;
    })
    .addCase(getSingleUser.fulfilled, (state, action) => {
      state.singleUserStatus = 'succeeded';
      state.singleUser = action.payload.data;
      state.singleUserError = null;
    })
    .addCase(getSingleUser.rejected, (state, action) => {
      state.singleUserStatus = 'failed';
      state.singleUserError = action.error.message;
    })
    .addCase(updateUser.pending, (state) => {
      state.updateStatus = 'loading';
      state.updateError = null;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.updateStatus = 'succeeded';
      state.singleUser = action.payload.data;
      state.updateError = null;
      toast.success(action.payload.message);
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.updateStatus = 'failed';
      state.updateError = action.error.message;
      toast.error(action.payload);
    })
  }
})

export const { reset } = userSlice.actions;

export const selectUsers = (state) => state.users.user;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export const selectSingleUser = (state) => state.users.singleUser;
export const selectSingleUserStatus = (state) => state.users.singleUserStatus;
export const selectSingleUserError = (state) => state.users.singleUserError;

export const selectUserUpdateStatus = (state) => state.users.updateStatus;
export const selectUserUpdateError = (state) => state.users.updateError;

export default userSlice.reducer;