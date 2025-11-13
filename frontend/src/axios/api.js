export const baseURL = "http://localhost:5041/";

export const API_URLS = {
    // Auth
    REGISTER_USER: "/auth/register",
    LOGIN_USER: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh",

    // Position
    GET_POSITIONS: "/positions",
    GET_POSITION: "/positions/:id",
    GET_MY_POSITIONS: "/positions/my-position",
    CREATE_POSITION: "/positions",
    UPDATE_POSITION: "/positions/:id",
    DELETE_POSITION: "/positions/:id"
};