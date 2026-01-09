import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { bulkUploadUsers, changeUserRole, getSingleUser, getUsers, updateUser, uploadUserCV } from "./usersApi";

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  singleUser: null,
  singleUserStatus: 'idle',
  singleUserError: null,
  updateStatus: 'idle',
  updateError: null,
  bulkUploadData: null,
  bulkUploadStatus: 'idle',
  bulkUploadError: null,
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
      state.changeUserRoleStatus = 'idle';
      state.changeUserRoleError = null;
      state.uploadCVStatus = 'idle';
      state.uploadCVError = null;
    }
  },
  extraReducers: (builder) => {
    builder
    // Get Users
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

    // Get Single User
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
    
    // Update User
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

    // Update User Role
    .addCase(changeUserRole.pending, (state) => {
      state.changeUserRoleStatus = 'loading';
      state.changeUserRoleError = null;
    })
    .addCase(changeUserRole.fulfilled, (state, action) => {
      state.changeUserRoleStatus = 'succeeded';

      const index = state.user?.data?.findIndex(
        user => user.id === action.payload.data.id
      );
      if (index !== -1) {
        state.user.data[index] = action.payload.data;
      }

      state.changeUserRoleError = null;
      toast.success(action.payload.message);
    })
    .addCase(changeUserRole.rejected, (state, action) => {
      state.changeUserRoleStatus = 'failed';
      state.changeUserRoleError = action.error.message;
      toast.error(action.payload);
    })
    
    // Bulk Upload Users
    .addCase(bulkUploadUsers.pending, (state) => {
      state.bulkUploadStatus = 'loading';
      state.bulkUploadError = null;
    })
    .addCase(bulkUploadUsers.fulfilled, (state, action) => {
      state.bulkUploadStatus = 'succeeded';
      state.bulkUploadData = action.payload.data;
      state.bulkUploadError = null;
      toast.success(action.payload.message);
    })
    .addCase(bulkUploadUsers.rejected, (state, action) => {
      state.bulkUploadStatus = 'failed';
      state.bulkUploadError = action.error.message;
      toast.error(action.payload);
    })

    // Upload User CV
    .addCase(uploadUserCV.pending, (state) => {
      state.uploadCVStatus = 'loading';
      state.uploadCVError = null;
    })
    .addCase(uploadUserCV.fulfilled, (state, action) => {
      state.uploadCVStatus = 'succeeded';
      state.uploadCVError = null;
      if (state.singleUser) {
        state.singleUser.cvPath = action.payload.data?.cvPath;
      }
      toast.success(action.payload.message);
    })
    .addCase(uploadUserCV.rejected, (state, action) => {
      state.uploadCVStatus = 'failed';
      state.uploadCVError = action.error.message;
      toast.error(action.payload);
    })
  }
})

export const { reset } = userSlice.actions;

export const selectUsers = (state) => state.users.user?.data;
export const selectUsersQueryParameters = (state) => state.users.user?.queryParameters;
export const selectUsersPaginationMeta = (state) => state.users.user?.meta;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export const selectSingleUser = (state) => state.users.singleUser;
export const selectSingleUserStatus = (state) => state.users.singleUserStatus;
export const selectSingleUserError = (state) => state.users.singleUserError;

export const selectUserUpdateStatus = (state) => state.users.updateStatus;
export const selectUserUpdateError = (state) => state.users.updateError;

export const selectBulkUploadStatus = (state) => state.users.bulkUploadStatus;
export const selectBulkUploadError = (state) => state.users.bulkUploadError;
export const selectBulkUploadData = (state) => state.users.bulkUploadData;

export default userSlice.reducer;