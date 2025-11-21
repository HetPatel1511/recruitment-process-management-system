import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URLS } from "../../axios/api";
import axios from "../../axios";

export const getSkills = createAsyncThunk(
  "skills/getSkills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URLS.GET_SKILLS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createSkill = createAsyncThunk(
  "skills/createSkill",
  async (skillData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.CREATE_SKILL, skillData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
