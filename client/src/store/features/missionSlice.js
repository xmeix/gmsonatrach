import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  missions: [],
  isLoading: false,
  failure: false,
};

export const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    setMissions: (state, action) => {
      state.missions = action.payload;
    },
    fetchMissionStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchMissionEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchMissionFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
    freeMission: (state) => {
      state.missions = [];
    },
  },
});

export const {
  setMissions,
  fetchMissionStart,
  fetchMissionEnd,
  fetchMissionFailure,
  freeMission,
} = missionSlice.actions;

export default missionSlice.reducer;
