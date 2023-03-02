import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isFetching: false,
    error: false,
    isLoggedIn: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },

    logoutStart: (state) => {
      state.isFetching = true;
    },
    logoutSuccess: (state) => {
      state.isFetching = false;
      state.user = null;
      state.isLoggedIn = false;
    },

    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.user = action.payload;
      state.isAdmin = action.payload.isAdmin;
      state.isLoggedIn = true;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logoutFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
} = userSlice.actions;
export default userSlice.reducer;
