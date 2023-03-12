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

export const getMissions = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/mission/");
    console.log("missions" + JSON.stringify(res.data));
    dispatch(setMissions(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    dispatch(fetchFailure());
  }
};
export const getDemandes = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/demande/");
    //console.log(res.data);
    dispatch(setDemandes(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    dispatch(fetchFailure());
  }
};
//set users ...

export const getRFMs = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/rapportFM/");
    console.log("RFMS: " + JSON.stringify(res.data));
    dispatch(setRFMs(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    dispatch(fetchFailure());
  }
};
export const getOMs = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/ordremission/");
    //console.log(res.data.filteredOMissions);
    dispatch(setOMs(res.data.filteredOMissions));
    dispatch(fetchEnd());
  } catch (err) {
    dispatch(fetchFailure());
  }
};
export const getDepenses = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/depense/");
    //console.log(res.data);
    dispatch(setDepenses(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    dispatch(fetchFailure());
  }
};

export const getUsers = async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get("/auth/");
    //console.log(JSON.stringify(res.data));
    dispatch(setUsers(res.data));
    dispatch(fetchEnd());
  } catch (err) {
    dispatch(fetchFailure());
  }
};
