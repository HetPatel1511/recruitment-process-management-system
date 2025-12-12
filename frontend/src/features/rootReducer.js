import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import positionsReducer from "./positions/positionsSlice";
import skillsReducer from "./skills/skillsSlice";
import usersReducer from "./users/usersSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    positions: positionsReducer,
    skills: skillsReducer,
    users: usersReducer,
});

export default rootReducer;