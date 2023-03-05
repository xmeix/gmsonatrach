import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isLoggedIn: false,
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
      state.demandes = action.payload.demandes;
    },
    loginStart: (state) => {
      state.isLoading = true;
    },
    logoutStart: (state) => {
      state.isLoading = true;
    },
  },
});

export const { setLogin, setLogout, setDemandes, loginStart, logoutStart } =
  authSlice.actions;
export default authSlice.reducer;
