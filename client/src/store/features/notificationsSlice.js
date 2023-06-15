import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  isLoading: false,
  failure: false,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    fetchNotificationStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchNotificationEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchNotificationFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
    freeNotification: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setNotifications,
  fetchNotificationStart,
  fetchNotificationEnd,
  fetchNotificationFailure,
  freeNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
