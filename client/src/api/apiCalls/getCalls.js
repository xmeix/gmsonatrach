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

const fetchData = async (dispatch, endpoint, socketEvent, num) => {
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

export const getMissions = async (dispatch, num) => {
  await fetchData(dispatch, "/mission/", "mission", num);
  // getMissionKPIS(dispatch, 1);
};

export const getDemandes = async (dispatch, num) => {
  await fetchData(dispatch, "/demande/", "demande", num);
  // getFileKPIS(dispatch, 1);
};

export const getRFMs = async (dispatch, num) => {
  await fetchData(dispatch, "/rapportFM/", "rfm", num);
  // getFileKPIS(dispatch, 1);
};

export const getOMs = async (dispatch, num) => {
  await fetchData(dispatch, "/ordremission/", "om", num);
  // getFileKPIS(dispatch, 1);
};

export const getUsers = async (dispatch, num) => {
  await fetchData(dispatch, "/auth/users", "user", num);
};
export const getMissionKPIS = async (dispatch, num) => {
  await fetchData(dispatch, "/kpis/mission", "missionkpi", num);
};
export const getFileKPIS = async (dispatch, num) => {
  await fetchData(dispatch, "/kpis/file", "filekpi", num);
};
export const getNotifications = async (dispatch, num) => {
  await fetchData(dispatch, "/notification/", "notification", num);
};
export const getTickets = async (dispatch, num) => {
  await fetchData(dispatch, "/ticket/", "ticket", num);
};
export const getBestEmployes = async (endpoint) => {
  const res = await apiService.user.get(endpoint);
  console.log(res.data);
  return res.data;
};
