import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isLoggedIn: false,
  failure: false,
  users: [],
  demandes: [],
  missions: [],
  rfms: [],
  depenses: [],
  oms: [],
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
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isLoggedIn = false;
    },
    setDemandes: (state, action) => {
      state.demandes = action.payload;
    },
    setRFMs: (state, action) => {
      state.rfms = action.payload;
    },
    setMissions: (state, action) => {
      state.missions = action.payload;
    },
    setOMs: (state, action) => {
      state.oms = action.payload;
    },
    setDepenses: (state, action) => {
      state.depenses = action.payload;
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
  setDemandes,
  loginStart,
  logoutStart,
  fetchStart,
  fetchEnd,
  fetchFailure,
  setMissions,
  setRFMs,
  setOMs,
  setDepenses,
  setUsers,
} = authSlice.actions;
export default authSlice.reducer;
