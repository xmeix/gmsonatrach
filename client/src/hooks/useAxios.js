import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../api/apiService";
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

const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const callApi = async (method, url, body) => {
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      let response;

      switch (method) {
        case "post":
          response = await apiService.user.post(url, body);

          if (url === "/auth/login") {
            dispatch(setLogin(response.data));
          } else if (url === "/auth/logout") {
            dispatch(setLogout());
          }

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

      if (url === "/auth/login") {
        const { user } = response.data;

        if (user.role === "employe") {
          Promise.all([
            getDemandes(dispatch),
            getMissions(dispatch),
            getRFMs(dispatch),
            getOMs(dispatch),
            getDepenses(dispatch),
          ]);
        } else {
          Promise.all([
            getDemandes(dispatch),
            getMissions(dispatch),
            getRFMs(dispatch),
            getOMs(dispatch),
            getDepenses(dispatch),
            getUsers(dispatch),
          ]);
        }
      } else if (
        url === "/demande/DB" ||
        url === "/demande/DC" ||
        url === "/demande/DM"
      ) {
        getDemandes(dispatch);
      } else if (url === "/auth/register") {
        getUsers(dispatch);
      } else if (url === "/mission") {
        getMissions(dispatch);
      }

      setSuccessMsg(response.data.msg);
    } catch (error) {
      console.log(error);
      setError(error.response?.data.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
      dispatch(fetchEnd());
    }
  };

  useEffect(() => {
    Promise.all([
      getMissions(dispatch),
      getRFMs(dispatch),
      getOMs(dispatch),
      getDepenses(dispatch),
      getUsers(dispatch),
    ]);
  }, []);

  return {
    isLoading,
    error,
    successMsg,
    callApi,
  };
};

export default useAxios;
