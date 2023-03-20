import { io } from "socket.io-client";
import {
  fetchEnd,
  fetchFailure,
  fetchStart,
  setDemandes,
  setDepenses,
  setMissions,
  setOMs,
  setRFMs,
  setUsers,
} from "../../store/features/authSlice";
import { apiService } from "../apiService";
const socket = io("http://localhost:3001");

export const getMissions = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/mission/");
    console.log("getting missions...");

    dispatch(setMissions(res.data));

    dispatch(fetchEnd());
  } catch (err) {
    console.log("ERROR is TERROR");
    dispatch(fetchFailure());
  }
};
export const getDemandes = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/demande/");
    console.log("getting demandes...");
 
    socket.emit("updatedData", res.data);

    dispatch(fetchEnd());
  } catch (err) {
    console.log("ERROR is TERROR");
    dispatch(fetchFailure());
  }
};

export const getRFMs = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/rapportFM/");
    console.log("getting RFMS...");
    dispatch(setRFMs(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    console.log("ERROR is TERROR");
    dispatch(fetchFailure());
  }
};
export const getOMs = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/ordremission/");
    console.log("getting OMs...");
    dispatch(setOMs(res.data.filteredOMissions));
    dispatch(fetchEnd());
  } catch (err) {
    console.log("ERROR is TERROR");
    dispatch(fetchFailure());
  }
};
export const getDepenses = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/depense/");
    console.log("getting depenses...");
    dispatch(setDepenses(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    console.log("ERROR is TERROR");
    dispatch(fetchFailure());
  }
};

export const getUsers = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/auth/users");
    console.log("getting users...");
    dispatch(setUsers(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    console.log("ERROR is TERROR USERS ");
    dispatch(fetchFailure());
  }
};
