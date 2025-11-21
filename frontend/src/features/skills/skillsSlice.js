import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createSkill, getSkills } from "./skillsApi";

const initialState = {
  skills: [],
  status: 'idle',
  error: null,
}

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    reset: (state) => {
      state.skills = [];
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get skills
      .addCase(getSkills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = action.payload.data;
        state.error = null;
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Create skill
      .addCase(createSkill.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = [...state.skills, action.payload.data];
        state.error = null;
        toast.success(action.payload.message);
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        toast.error(action.error.message);
      })
  }
})

export const { reset, clearError } = skillSlice.actions;

export const selectSkills = (state) => state.skills.skills;
export const selectSkillsStatus = (state) => state.skills.status;
export const selectSkillsError = (state) => state.skills.error;

export default skillSlice.reducer;