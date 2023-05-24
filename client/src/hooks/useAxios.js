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
  getFileKPIS,
  getMissionKPIS,
  getMissions,
  getNotifications,
  getOMs,
  getRFMs,
  getUsers,
} from "../api/apiCalls/getCalls";
import { freeKpis } from "../store/features/statSlice";
import { socket } from "../App";

export const useAxios = () => {
  // const isLoading = useSelector((state) => state.auth.isLoading);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const callApi = async (method, url, body) => {
    console.log("making a call...");
    setError("");
    setSuccessMsg("");
    dispatch(fetchStart());
    setIsLoading(true);
    try {
      let response;

      switch (method) {
        case "post":
          response = await apiService.user.post(url, body);
          handleSuccess(response, url, body);
          break;
        case "delete":
          response = await apiService.user.delete(url);
          handleSuccess(response, "/auth/user");
          break;
        case "patch":
          console.log(url, body);
          response = await apiService.user.patch(url, body);
          console.log(response);
          if (url.includes("/rapportFM")) {
            handleSuccess(response, "/rapportFM", body);
          } else if (url.includes("/demande")) {
            handleSuccess(response, "/demande", body);
          } else if (url.includes("/mission")) {
            handleSuccess(response, "/mission", body);
          } else if (url.includes("/auth/user")) {
            console.log("its here");
            handleSuccess(response, "/auth/user", body);
          } else handleSuccess(response, url, body);
          break;
        default:
          throw new Error(`Invalid HTTP method: ${method}`);
      }
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };
  const handleSuccess = (response, url, body) => {
    dispatch(fetchEnd());
    setSuccessMsg(response.data.msg);

    switch (url) {
      case "/auth/login":
        dispatch(setLogin(response.data));
        handleUserType(response.data);
        if (
          response.data.user.role !== "employe" &&
          response.data.user.role !== "relex"
        ) {
          getMissionKPIS(dispatch, 1);
          getFileKPIS(dispatch, 1);
          getUsers(dispatch, 1);
        }
        break;
      case "/auth/logout":
        dispatch(setLogout());
        dispatch(freeKpis());
        break;
      case "/auth/register":
        getUsers(dispatch);
        break;
      case "/mission":
        getMissions(dispatch);
        if (currentUser.role !== "employe" && currentUser.role !== "relex") {
          getMissionKPIS(dispatch, 1);
          getFileKPIS(dispatch, 1);
        }

        break;
      case "/demande/DB":
      case "/demande/DC":
      case "/demande/DM":
      case "/demande":
        getDemandes(dispatch);
        if (currentUser.role !== "employe" && currentUser.role !== "relex") {
          getFileKPIS(dispatch, 1);
        }
        break;
      case "/auth/user":
        if (currentUser.role !== "employe" && currentUser.role !== "relex") {
          getUsers(dispatch);
        }
        break; 
      case "/rapportFM":
        if (currentUser.role === "employe" && !body.etat) {
          getRFMs(dispatch, 1);
        } else {
          getRFMs(dispatch);
        }

        if (currentUser.role !== "employe" && currentUser.role !== "relex") {
          getFileKPIS(dispatch, 1);
        }
        break;
      default:
        handleUserType(currentUser.role);
    }
  };
  const handleError = (error) => {
    console.log(error);
    setError(error.response?.data.error || "Something went wrong.");
    dispatch(fetchFailure());
  };
  const handleUserType = (data) => {
    getMissions(dispatch, 1);
    getRFMs(dispatch, 1);
    getOMs(dispatch, 1);
    // getDepenses(dispatch, 1);
    getDemandes(dispatch, 1);
    getNotifications(dispatch, 1);
  };
  return {
    isLoading,
    error,
    successMsg,
    callApi,
  };
};
