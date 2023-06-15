import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rfms: [],
  isLoading: false,
  failure: false,
};

export const rfmsSlice = createSlice({
  name: "rfms",
  initialState,
  reducers: {
    setRfms: (state, action) => {
      state.rfms = action.payload;
    },
    fetchRfmsStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchRfmsEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchRfmsFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
    freeRfms: (state) => {
      state.rfms = [];
    },
  },
});

export const {
  setRfms,
  fetchRfmsStart,
  fetchRfmsEnd,
  fetchRfmsFailure,
  freeRfms,
} = rfmsSlice.actions;

export default rfmsSlice.reducer;
