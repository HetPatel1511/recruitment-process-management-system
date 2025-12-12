import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { addSkillsToPosition, addSkillsToUser, createSkill, getPositionSkills, getSkills, getUserSkills } from "./skillsApi";

const initialState = {
  skills: [],
  status: 'idle',
  error: null,
  positionId: null,
  positionSkills: [],
  positionSkillsStatus: 'idle',
  positionSkillsError: null,
  userId: null,
  userSkills: [],
  userSkillsStatus: 'idle',
  userSkillsError: null,
}

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    reset: (state) => {
      state.skills = [];
      state.status = 'idle';
      state.error = null;
      state.positionId = null;
      state.positionSkills = [];
      state.positionSkillsStatus = 'idle';
      state.positionSkillsError = null;
      state.userId = null;
      state.userSkills = [];
      state.userSkillsStatus = 'idle';
      state.userSkillsError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.positionSkillsError = null;
      state.userSkillsError = null;
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

      // Get position skills
      .addCase(getPositionSkills.pending, (state) => {
        state.positionSkillsStatus = 'loading';
        state.positionSkillsError = null;
      })
      .addCase(getPositionSkills.fulfilled, (state, action) => {
        state.positionId = action.payload.data.position.id;
        state.positionSkillsStatus = 'succeeded';
        state.positionSkills = action.payload.data.skills;
        state.positionSkillsError = null;
      })
      .addCase(getPositionSkills.rejected, (state, action) => {
        state.positionSkillsStatus = 'failed';
        state.positionSkillsError = action.error.message;
      })

      // Add skills to position
      .addCase(addSkillsToPosition.pending, (state) => {
        state.positionSkillsStatus = 'loading';
        state.positionSkillsError = null;
      })
      .addCase(addSkillsToPosition.fulfilled, (state, action) => {
        state.positionId = action.payload.data.position.id;
        state.positionSkillsStatus = 'succeeded';
        state.positionSkills = action.payload.data.skills;
        state.positionSkillsError = null;
      })
      .addCase(addSkillsToPosition.rejected, (state, action) => {
        state.positionSkillsStatus = 'failed';
        state.positionSkillsError = action.error.message;
        toast.error(action.payload.message);
      })

      // Get user skills
      .addCase(getUserSkills.pending, (state) => {
        state.userSkillsStatus = 'loading';
        state.userSkillsError = null;
      })
      .addCase(getUserSkills.fulfilled, (state, action) => {
        state.userId = action.payload.data.user.id;
        state.userSkillsStatus = 'succeeded';
        state.userSkills = action.payload.data.skills;
        state.userSkillsError = null;
      })
      .addCase(getUserSkills.rejected, (state, action) => {
        state.userSkillsStatus = 'failed';
        state.userSkillsError = action.error.message;
      })

      // Add skills to user
      .addCase(addSkillsToUser.pending, (state) => {
        state.userSkillsStatus = 'loading';
        state.userSkillsError = null;
      })
      .addCase(addSkillsToUser.fulfilled, (state, action) => {
        state.userId = action.payload.data.user.id;
        state.userSkillsStatus = 'succeeded';
        state.userSkills = action.payload.data.skills;
        state.userSkillsError = null;
        toast.success(action.payload.message);
      })
      .addCase(addSkillsToUser.rejected, (state, action) => {
        state.userSkillsStatus = 'failed';
        state.userSkillsError = action.error.message;
        toast.error(action.payload.message);
      })
  }
})

export const { reset, clearError } = skillSlice.actions;

export const selectSkills = (state) => state.skills.skills;
export const selectSkillsStatus = (state) => state.skills.status;
export const selectSkillsError = (state) => state.skills.error;
export const selectPositionSkills = (state) => state.skills.positionSkills;
export const selectPositionSkillsStatus = (state) => state.skills.positionSkillsStatus;
export const selectPositionSkillsError = (state) => state.skills.positionSkillsError;
export const selectUserSkills = (state) => state.skills.userSkills;
export const selectUserSkillsStatus = (state) => state.skills.userSkillsStatus;
export const selectUserSkillsError = (state) => state.skills.userSkillsError;

export default skillSlice.reducer;