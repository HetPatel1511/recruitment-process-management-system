import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlics";

const rootReducer = combineReducers({
    auth: authReducer
});

export default rootReducer;