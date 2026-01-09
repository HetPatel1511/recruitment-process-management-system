import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URLS } from "../../axios/api";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { selectSingleUser } from "../users/usersSlice";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URLS.GET_USERS, {
        params: data
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getSingleUser = createAsyncThunk(
  "users/getSingleUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URLS.GET_SINGLE_USER.replace(":id", data.id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const authenticatedUser = state.auth.user
      if (authenticatedUser?.id != data?.id) {
        return rejectWithValue("You are not authorized to update this user");
      } else {
        delete data.id;
        const response = await axios.put(API_URLS.UPDATE_USER, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const changeUserRole = createAsyncThunk(
  "users/changeUserRole",
  async (data, { rejectWithValue }) => {
    try {
      const userId = data.userId;
      delete data.userId;
      const response = await axios.put(API_URLS.CHANGE_USER_ROLE.replace(":id", userId), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
)

export const bulkUploadUsers = createAsyncThunk(
  "users/bulkUploadUsers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.BULK_UPLOAD_USERS, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
)

export const uploadUserCV = createAsyncThunk(
  "users/uploadUserCV",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.UPLOAD_USER_CV, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
)