import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logoutSuccess } from "./../store/features/userSlice";

const useAuth = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      const user = response.data;
      dispatch(loginSuccess(user));
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3001/auth/logout");
      dispatch(logoutSuccess());
    } catch (error) {
      console.error(error);
    }
  };

  return { isLoggedIn, user, login, logout };
};

export default useAuth;
