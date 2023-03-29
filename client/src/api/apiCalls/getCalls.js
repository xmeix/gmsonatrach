import { socket } from "../../App";
import {
  fetchEnd,
  fetchFailure,
  fetchStart,
  setDemandes,
  setMissions,
  setOMs,
  setRFMs,
  setUsers,
} from "../../store/features/authSlice";
import { setMissionKpis } from "../../store/features/statSlice";
import { apiService } from "../apiService";

const fetchData = async (dispatch, endpoint, socketEvent, num) => {
  dispatch(fetchStart());
  try {
    const res = await apiService.user.get(endpoint);

    if (!num || num !== 1) {
      if (socketEvent === "om") {
        socket.emit("updatedData", res.data.filteredOMissions, socketEvent);
      } else {
        socket.emit("updatedData", res.data, socketEvent);
      }
    } else {
      if (socketEvent === "mission") {
        dispatch(setMissions(res.data));
      } else if (socketEvent === "om") {
        dispatch(setOMs(res.data.filteredOMissions));
      } else if (socketEvent === "rfm") {
        dispatch(setRFMs(res.data));
      } else if (socketEvent === "demande") {
        dispatch(setDemandes(res.data));
      } else if (socketEvent === "user") {
        dispatch(setUsers(res.data));
      } else if (socketEvent === "missionkpi") {
        dispatch(setMissionKpis(res.data));
      } else dispatch(setRFMs(res.data));
    }
    dispatch(fetchEnd());
  } catch (err) {
    console.log(`ERROR getting ${endpoint}`);
    dispatch(fetchFailure());
  }
};

export const getMissions = async (dispatch, num) => {
  await fetchData(dispatch, "/mission/", "mission", num);
};

export const getDemandes = async (dispatch, num) => {
  await fetchData(dispatch, "/demande/", "demande", num);
};

export const getRFMs = async (dispatch, num) => {
  await fetchData(dispatch, "/rapportFM/", "rfm", num);
};

export const getOMs = async (dispatch, num) => {
  await fetchData(dispatch, "/ordremission/", "om", num);
};

export const getDepenses = async (dispatch, num) => {
  await fetchData(dispatch, "/depense/", "depense", num);
};

export const getUsers = async (dispatch, num) => {
  await fetchData(dispatch, "/auth/users", "user", num);
};
export const getMissionKPIS = async (dispatch, num) => {
  await fetchData(dispatch, "/kpis/mission", "missionkpi", num);
};
