import { socket } from "../../App";
import {
  fetchEnd,
  fetchFailure,
  fetchStart,
  setDemandes,
  setMissions,
  setNotifications,
  setOMs,
  setRFMs,
  setTickets,
  setUsers,
} from "../../store/features/authSlice";
import { setFilesKpis, setMissionKpis } from "../../store/features/statSlice";
import { apiService } from "../apiService";

const fetchData = async (dispatch, endpoint, socketEvent) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get(endpoint);
    console.log(endpoint);
    const eventToActionMap = {
      mission: setMissions,
      om: (data) => setOMs(data.filteredOMissions),
      rfm: setRFMs,
      demande: setDemandes,
      user: setUsers,
      missionkpi: setMissionKpis,
      filekpi: setFilesKpis,
      notification: setNotifications,
      ticket: setTickets,
    };
    const setDataFunc = eventToActionMap[socketEvent];
    dispatch(setDataFunc(res.data));

    dispatch(fetchEnd());
  } catch (err) {
    console.log(`ERROR getting ${endpoint}`);
    dispatch(fetchFailure());
  }
};

export const getMissions = (dispatch) => {
  fetchData(dispatch, "/mission/", "mission");
  // getMissionKPIS(dispatch, 1);
};

export const getDemandes = (dispatch) => {
  fetchData(dispatch, "/demande/", "demande");
  // getFileKPIS(dispatch, 1);
};

export const getRFMs = (dispatch) => {
  fetchData(dispatch, "/rapportFM/", "rfm");
  // getFileKPIS(dispatch, 1);
};

export const getOMs = (dispatch) => {
  fetchData(dispatch, "/ordremission/", "om");
  // getFileKPIS(dispatch, 1);
};

export const getUsers = (dispatch) => {
  fetchData(dispatch, "/auth/users", "user");
};
export const getMissionKPIS = (dispatch) => {
  fetchData(dispatch, "/kpis/mission", "missionkpi");
};
export const getFileKPIS = (dispatch) => {
  fetchData(dispatch, "/kpis/file", "filekpi");
};
export const getNotifications = (dispatch) => {
  fetchData(dispatch, "/notification/", "notification");
};
export const getTickets = (dispatch) => {
  fetchData(dispatch, "/ticket/", "ticket");
};
export const getBestEmployes = async (endpoint) => {
  const res = await apiService.user.get(endpoint);
  console.log(res.data);
  return res.data;
};
