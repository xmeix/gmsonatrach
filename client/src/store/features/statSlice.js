import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  missionKPIS: [],
  filesKPIS: [],
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
  },
});

export const { freeKpis, setMissionKpis, setFilesKpis } = statSlice.actions;

export default statSlice.reducer;
