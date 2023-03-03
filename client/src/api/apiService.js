import axios from "axios";

const API_BASE_URL = "http://localhost:3001/";

export const publicRequest = axios.create({
  baseURL: API_BASE_URL,
});

export const userRequest = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const apiService = {
  public: {
    get: (url, config) => publicRequest.get(url, config),
    post: (url, data, config) => publicRequest.post(url, data, config),
  },
  user: {
    get: (url, config) => userRequest.get(url, config),
    post: (url, data, config) => userRequest.post(url, data, config),
    put: (url, data, config) => userRequest.put(url, data, config),
    delete: (url, config) => userRequest.delete(url, config),
  },
};
/**
 * apiService.user.get('/users', {
 *    headers: {
 *  'Authorization': 'Bearer ' + authToken,
 * },
 * })
 */
