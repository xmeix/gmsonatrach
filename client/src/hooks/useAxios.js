import { useSelector, useDispatch } from "react-redux";
import { apiService } from "../api/apiService";
import { useState } from "react";
import {
  fetchEnd,
  fetchFailure,
  fetchStart,
  setLogin,
  setLogout,
} from "../store/features/authSlice";
import { freeKpis } from "../store/features/statSlice";

export const useAxios = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const callApi = async (method, url, body) => {
    console.log("making a call...");
    dispatch(fetchStart());
    setIsLoading(true);

    try {
      const response = await apiService.user[method](url, body);
      handleSuccess(response, url, body);
    } catch (error) {
      handleError(error);
    }

    setIsLoading(false);
  };

  const handleSuccess = (response, url, body) => {
    dispatch(fetchEnd());

    const actionMap = {
      "/auth/login": () => dispatch(setLogin(response.data)),
      "/auth/logout": () => {
        dispatch(setLogout());
        dispatch(freeKpis());
      },
    };

    if (actionMap[url]) {
      actionMap[url]();
    }
  };

  const handleError = (error) => {
    console.log(error);
    dispatch(fetchFailure());
  };

  return {
    isLoading,
    callApi,
  };
};
