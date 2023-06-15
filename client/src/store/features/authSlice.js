import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../App";

const initialState = {
  user: null,
  token: localStorage.getItem("jwt"),
  isLoading: false,
  failure: false,
  isLoggedIn: false,

  users: [],
  // demandes: [],
  // missions: [],
  // rfms: [],
  // depenses: [],
  // oms: [],
  // notifications: [],
  // tickets: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.isLoading = false;
      localStorage.setItem("jwt", action.payload.token);
      // socket.emit("login", action.payload.user, state.token);
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("jwt", action.payload.token);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.users = [];
      socket.emit("logout", state.token);
    },

    setUsers: (state, action) => {
      state.users = action.payload;
    },
    loginStart: (state) => {
      state.isLoading = true;
    },
    logoutStart: (state) => {
      state.isLoading = true;
    },
    fetchStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
  },
});

export const {
  setLogin,
  setLogout,
  // setDemandes,
  loginStart,
  logoutStart,
  fetchStart,
  fetchEnd,
  fetchFailure,
  // setMissions,
  // setRFMs,
  // setOMs,
  // setDepenses,
  setUsers,
  getTokenFromState,
  setToken,
  // setNotifications,
  // setTickets,
} = authSlice.actions;

export default authSlice.reducer;
