import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import positionsReducer from "./positions/positionsSlice";
import positionApplicantsReducer from "./positions/positionApplicantsSlice";
import skillsReducer from "./skills/skillsSlice";
import usersReducer from "./users/usersSlice";
import rolesReducer from "./roles/rolesSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    positions: positionsReducer,
    positionApplicants: positionApplicantsReducer,
    skills: skillsReducer,
    users: usersReducer,
    roles: rolesReducer,
});

export default rootReducer;