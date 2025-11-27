import axios from "axios";
import {baseURL, API_URLS} from "./api";

axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(
    request => {
      const accessToken = localStorage.getItem("accessToken");
      if (request.url!==API_URLS.LOGIN_USER && request.url!==API_URLS.REGISTER_USER) {
        if (accessToken) {
            request.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }
      return request;
    },
    error => {
        throw error;
    }
)

axios.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        console.log("error");
        console.log(error);
        
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    return Promise.reject(error);
                }
                const refreshResponse = await axios.post(API_URLS.REFRESH_TOKEN, { refreshToken });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axios(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)

export default axios