import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  oms: [],
  isLoading: false,
  failure: false,
};

export const omsSlice = createSlice({
  name: "oms",
  initialState,
  reducers: {
    setOms: (state, action) => {
      state.oms = action.payload;
    },
    fetchOmsStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchOmsEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchOmsFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
    freeOms: (state) => {
      state.oms = [];
    },
  },
});

export const { setOms, fetchOmsStart, fetchOmsEnd, fetchOmsFailure, freeOms } =
  omsSlice.actions;

export default omsSlice.reducer;
