import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  missionKPIS: [],
};

export const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    setMissionKpis: (state, action) => {
      state.missionKPIS = action.payload;
    },
    freeKpis: (state, action) => {
      state.missionKPIS = [];
    },
  },
});

export const { freeKpis, setMissionKpis } = statSlice.actions;

export default statSlice.reducer;
