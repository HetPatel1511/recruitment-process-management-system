import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import positionsReducer from "./positions/positionsSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    positions: positionsReducer
});

export default rootReducer;