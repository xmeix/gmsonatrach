import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  demandes: [],
  isLoading: false,
  failure: false,
};

export const demandeSlice = createSlice({
  name: "demande",
  initialState,
  reducers: {
    setDemandes: (state, action) => {
      state.demandes = action.payload;
    },
    fetchDemandeStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchDemandeEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchDemandeFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
    freeDemande: (state) => {
      state.demandes = [];
    },
  },
});

export const {
  setDemandes,
  fetchDemandeStart,
  fetchDemandeEnd,
  fetchDemandeFailure,
  freeDemande,
} = demandeSlice.actions;

export default demandeSlice.reducer;
