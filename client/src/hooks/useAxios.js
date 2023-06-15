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
import { freeMission } from "../store/features/missionSlice";
import { freeTicket } from "../store/features/ticketSlice";
import { freeNotification } from "../store/features/notificationsSlice";
import { freeDemande } from "../store/features/demandeSlice";
import { freeOms } from "../store/features/omsSlice";
import { freeRfms } from "../store/features/rfmsSlice";
import { freeKpis } from "../store/features/statSlice";

export const useAxios = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const callApi = async (method, url, body) => {
    console.log("making a call...");
    dispatch(fetchStart());
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

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
    setSuccessMsg(response.data.msg);

    const actionMap = {
      "/auth/login": () => dispatch(setLogin(response.data)),
      "/auth/logout": () => {
        dispatch(freeKpis());
        dispatch(freeRfms());
        dispatch(freeOms());
        dispatch(freeDemande());
        dispatch(freeNotification());
        dispatch(freeTicket());
        dispatch(freeMission());
        dispatch(setLogout());
        localStorage.removeItem("jwt");
      },
    };

    if (actionMap[url]) {
      actionMap[url]();
    }
  };

  const handleError = (error) => {
    console.log(error);
    setError(error.response?.data.error || "Something went wrong.");
    dispatch(fetchFailure());
  };

  return {
    isLoading,
    callApi,
    successMsg,
    error,
    setError,
    setSuccessMsg,
  };
};
