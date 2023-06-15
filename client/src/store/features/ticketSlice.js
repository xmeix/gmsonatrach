import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
  isLoading: false,
  failure: false,
};

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    fetchTicketStart: (state) => {
      state.failure = false;
      state.isLoading = true;
    },
    fetchTicketEnd: (state) => {
      state.isLoading = false;
      state.failure = false;
    },
    fetchTicketFailure: (state) => {
      state.failure = true;
      state.isLoading = false;
    },
    freeTicket: (state) => {
      state.tickets = [];
    },
  },
});

export const {
  setTickets,
  fetchTicketStart,
  fetchTicketEnd,
  fetchTicketFailure,
  freeTicket,
} = ticketSlice.actions;

export default ticketSlice.reducer;
