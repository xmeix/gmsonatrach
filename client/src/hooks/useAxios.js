import { useSelector, useDispatch } from "react-redux";
import { apiService } from "../api/apiService";
import { useState } from "react";
import {
  fetchEnd,
  fetchFailure,
  fetchStart,
  setLogin,
  setLogout,
  setRFMs,
} from "../store/features/authSlice";
import {
  getDemandes,
  getDepenses,
  getMissionKPIS,
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
    dispatch(fetchStart());

    try {
      let response;

      switch (method) {
        case "post":
          response = await apiService.user.post(url, body);
          handleSuccess(response, url, body);
          break;
        case "delete":
          console.log("url " + url);
          response = await apiService.user.delete(url);
          console.log(response);
          handleSuccess(response, "/auth/user");
          break;
        case "patch":
          response = await apiService.user.patch(url, body);
          if (url.includes("/rapportFM")) {
            handleSuccess(response, "/rapportFM", body);
          } else if (url.includes("/demande")) {
            handleSuccess(response, "/demande", body);
          } else if (url.includes("/mission")) {
            handleSuccess(response, "/mission", body);
          } else handleSuccess(response, url, body);
          break;
        default:
          throw new Error(`Invalid HTTP method: ${method}`);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const handleSuccess = (response, url, body) => {
    dispatch(fetchEnd());
    setSuccessMsg(response.data.msg);

    switch (url) {
      case "/auth/login":
        dispatch(setLogin(response.data));
        handleUserType(response.data);
        break;
      case "/auth/logout":
        dispatch(setLogout());
        break;
      case "/auth/register":
        getUsers(dispatch);
        break;
      case "/mission":
        getMissions(dispatch);
        getOMs(dispatch);
        break;
      case "/demande/DB":
      case "/demande/DC":
      case "/demande/DM":
      case "/demande":
        getDemandes(dispatch);

        break;
      case "/auth/user":
        getUsers(dispatch);
        break;
      case "/rapportFM":
        console.log(body);
        console.log(response.data);
        if (currentUser.role === "employe" && !body.etat) {
          console.log("here");
          getRFMs(dispatch, 1);
        } else {
          console.log("inside of here");
          getRFMs(dispatch);
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
  const handleUserType = (role) => {
    getMissions(dispatch, 1);
    getRFMs(dispatch, 1);
    getOMs(dispatch, 1);
    getDepenses(dispatch, 1);
    getDemandes(dispatch, 1);

    if (role !== "employe" && role !== "relex") {
      getUsers(dispatch, 1);
      getMissionKPIS(dispatch, 1);
    }
  };
  return {
    isLoading,
    error,
    successMsg,
    callApi,
  };
};
