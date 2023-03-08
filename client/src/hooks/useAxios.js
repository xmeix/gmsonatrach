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
import {
  getDemandes,
  getDepenses,
  getMissions,
  getOMs,
  getRFMs,
  getUsers,
} from "../api/apiCalls/getCalls";

export const useAxios = () => {
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const callApi = async (method, url, body) => {
    console.log("hereCallAPI" + JSON.stringify(body));

    setError("");
    setSuccessMsg("");
    try {
      let response;
      dispatch(fetchStart());
      switch (method) {
        case "post":
          response = await apiService.user.post(url, body);
          if (url === "/auth/login") {
            dispatch(setLogin(response.data));
            getMissions(dispatch);
            getDemandes(dispatch);
            getRFMs(dispatch);
            getOMs(dispatch);
            getDepenses(dispatch);
            getUsers(dispatch);
          } else if (url === "/auth/logout") {
            dispatch(setLogout());
          }
          console.log("here");
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
      dispatch(fetchEnd());
      setSuccessMsg(response.data.msg);
    } catch (error) {
      console.log(error);
      setError(error.response?.data.error || "Something went wrong.");
      dispatch(fetchFailure());
    }
  };

  return {
    isLoading,
    error,
    successMsg,
    callApi,
  };
};
