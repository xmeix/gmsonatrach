import { useSelector, useDispatch } from "react-redux";
import { apiService } from "../api/apiService";
import { useState } from "react";

export const useAxios = (method) => {
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const [axiosError, setAxiosError] = useState("");
  const [axiosSuccessMsg, setAxiosSuccessMsg] = useState("");

  const callApi = async (url, body) => {
    setError("");
    setSuccessMsg("");
    try {
      let response;
      switch (method) {
        case "post":
          response = await apiService.user.post(url, body);
          break;
        case "delete":
          response = await apiService.user.delete(url, body);
          break;
        case "patch":
          response = await apiService.user.patch(url, body);
          break;
        default:
          throw new Error(`Invalid HTTP method: ${method}`);
      }
      setSuccessMsg(response.data.msg);
      return response;
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  return {
    isLoading,
    error,
    successMsg,
    callApi,
  };
};
