import axios from "axios";
const API_BASE_URL = "http://localhost:3001/";

export const publicRequest = axios.create({
  baseURL: API_BASE_URL,
});

const token = localStorage.getItem("jwt");
export const userRequest = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,
  },
  withCredentials: true,
});

userRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  public: {
    get: (url, config) => publicRequest.get(url, config),
    post: (url, data, config) => publicRequest.post(url, data, config),
  },
  user: {
    get: (url, config) => userRequest.get(url, config),
    post: (url, data, config) => userRequest.post(url, data, config),
    patch: (url, data, config) => userRequest.patch(url, data, config),
    delete: (url, config) => userRequest.delete(url, config),
  },
};
