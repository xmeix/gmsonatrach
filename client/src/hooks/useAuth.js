import { useSelector, useDispatch } from "react-redux";
import {
  loginStart,
  logoutStart,
  setLogin,
  setLogout,
} from "../store/features/authSlice";
import { apiService } from "../api/apiService";
import axios from "axios";
import { useState } from "react";
export const useAuth = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const login = async (email, password) => {
    setError("");
    setSuccessMsg("");
    try {
      dispatch(loginStart());
      const response = await apiService.public.post("/auth/login", {
        email,
        password,
      });
      dispatch(setLogin(response.data));

      setSuccessMsg(response.data.msg);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };
  const register = async (body) => {
    setError("");
    setSuccessMsg("");
    try {
      const response = await apiService.user.post("/auth/register", body);
      setSuccessMsg(response.data.msg);
      return response;
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  const logout = async () => {
    setError("");
    setSuccessMsg("");
    try {
      dispatch(logoutStart());
      await apiService.user.post("/auth/logout");
      dispatch(setLogout());
      setSuccessMsg(response.data.msg);
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
    }
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
    token,
    isLoading,
    register,
    error,
    successMsg,
  };
};
