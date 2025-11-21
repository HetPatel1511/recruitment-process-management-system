import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import positionsReducer from "./positions/positionsSlice";
import skillsReducer from "./skills/skillsSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    positions: positionsReducer,
    skills: skillsReducer,
});

export default rootReducer;