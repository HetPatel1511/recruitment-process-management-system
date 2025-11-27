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

export const getPositionSkills = createAsyncThunk(
  'skills/getPositionSkills',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URLS.GET_POSITION_SKILLS.replace(":id", data.positionId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addSkillsToPosition = createAsyncThunk(
  'skills/addSkillsToPosition',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URLS.ADD_SKILLS_TO_POSITION.replace(":id", data.positionId), {
        skillIds: data.skillIds
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

