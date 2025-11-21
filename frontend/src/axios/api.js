export const baseURL = "http://localhost:5041/";

export const API_URLS = {
    // Auth
    REGISTER_USER: "/auth/register",
    LOGIN_USER: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh",

    // Position
    GET_POSITIONS: "/positions",
    GET_SINGLE_POSITION: "/positions/:id",
    GET_MY_POSITIONS: "/positions/my-position",
    CREATE_POSITION: "/positions",
    UPDATE_POSITION: "/positions/:id",
    DELETE_POSITION: "/positions/:id",
    APPLY_FOR_POSITION: "/positions/apply/:id",

    // Skill
    GET_SKILLS: "/skills",
    GET_SINGLE_SKILL: "/skills/:id",
    CREATE_SKILL: "/skills",
};