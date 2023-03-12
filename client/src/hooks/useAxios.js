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
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const callApi = async (method, url, body) => {
    console.log("making a call...");

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
            getDemandes(dispatch);
            if (response.data.user.role === "employe") {
              getMissions(dispatch);
              getRFMs(dispatch);
              getOMs(dispatch);
              getDepenses(dispatch);
            } else {
              getMissions(dispatch);
              getRFMs(dispatch);
              getOMs(dispatch);
              getDepenses(dispatch);
              getUsers(dispatch);
            }
          } else if (url === "/auth/logout") {
            dispatch(setLogout());
          } else if (url === "/auth/register") {
            getUsers(dispatch);
          } else if (url === "/mission") {
            getMissions(dispatch);
          } else if (
            url === "/demande/DB" ||
            url === "/demande/DC" ||
            url === "/demande/DM"
          ) {
            getDemandes(dispatch);
          }
          console.log("post");
          break;
        case "delete":
          console.log("delete");
          response = await apiService.user.delete(url, body);
          break;
        case "patch":
          console.log("patch");
          response = await apiService.user.patch(url, body);
          getDemandes(dispatch);
          if (currentUser.role === "employe") {
            getMissions(dispatch);
            getRFMs(dispatch);
            getOMs(dispatch);
            getDepenses(dispatch);
          } else {
            getMissions(dispatch);
            getRFMs(dispatch);
            getOMs(dispatch);
            getDepenses(dispatch);
            getUsers(dispatch);
          }

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
