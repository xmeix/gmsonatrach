import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  missionKPIS: [],
  filesKPIS: [],
  isLoading: false,
  failure: false,
};

export const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    setMissionKpis: (state, action) => {
      state.missionKPIS = action.payload;
    },
    setFilesKpis: (state, action) => {
      state.filesKPIS = action.payload;
    },
    freeKpis: (state) => {
      state.missionKPIS = [];
      state.filesKPIS = [];
    },
    fetchStatStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchStatEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchStatFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
  },
});

export const {
  freeKpis,
  setMissionKpis,
  setFilesKpis,
  fetchStatStart,
  fetchStatEnd,
  fetchStatFailure,
} = statSlice.actions;

export default statSlice.reducer;
