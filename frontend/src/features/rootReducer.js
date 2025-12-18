import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import positionsReducer from "./positions/positionsSlice";
import skillsReducer from "./skills/skillsSlice";
import usersReducer from "./users/usersSlice";
import rolesReducer from "./roles/rolesSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    positions: positionsReducer,
    skills: skillsReducer,
    users: usersReducer,
    roles: rolesReducer,
});

export default rootReducer;