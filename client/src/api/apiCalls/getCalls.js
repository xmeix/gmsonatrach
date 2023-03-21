import { socket } from "../../App";
import {
  fetchEnd,
  fetchFailure,
  fetchStart,
} from "../../store/features/authSlice";
import { apiService } from "../apiService";

const fetchData = async (dispatch, endpoint, socketEvent) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get(endpoint);
    console.log(`getting ${endpoint}...`);
    socket.emit("updatedData", res.data, socketEvent);
    dispatch(fetchEnd());
  } catch (err) {
    console.log(`ERROR getting ${endpoint}`);
    dispatch(fetchFailure());
  }
};

export const getMissions = async (dispatch) => {
  await fetchData(dispatch, "/mission/", "mission");
};

export const getDemandes = async (dispatch) => {
  await fetchData(dispatch, "/demande/", "demande");
};

export const getRFMs = async (dispatch) => {
  await fetchData(dispatch, "/rapportFM/", "rfm");
};

export const getOMs = async (dispatch) => {
  await fetchData(dispatch, "/ordremission/", "om");
};

export const getDepenses = async (dispatch) => {
  await fetchData(dispatch, "/depense/", "depense");
};

export const getUsers = async (dispatch) => {
  await fetchData(dispatch, "/auth/users", "user");
};
