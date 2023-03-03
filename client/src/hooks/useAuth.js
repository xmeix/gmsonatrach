import { useSelector, useDispatch } from "react-redux";
import {
  loginStart,
  logoutStart,
  setLogin,
  setLogout,
} from "../store/features/authSlice";
import { apiService } from "../api/apiService";
import axios from "axios";
export const useAuth = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const dispatch = useDispatch();

  const login = async (email, password) => {
    try {
      dispatch(loginStart());
      const response = await apiService.public.post("/auth/login", {
        email,
        password,
      });
      dispatch(setLogin(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      dispatch(logoutStart());
      await apiService.user.post("/auth/logout");
      dispatch(setLogout());
    } catch (error) {
      console.error(error);
    }
  };

  return { isLoggedIn, user, login, logout, token, isLoading };
};
