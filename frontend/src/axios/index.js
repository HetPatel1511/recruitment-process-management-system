import axios from "axios";
import {baseURL, API_URLS} from "./api";

axios.defaults.baseURL = baseURL;
axios.interceptors.response.use(
    response => response,
    error => {
        throw error;
    }
)
axios.interceptors.request.use(
    request => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return request;
    },
    error => {
        throw error;
    }
)

export default axios