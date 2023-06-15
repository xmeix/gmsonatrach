import { socket } from "../../App";
import {
  fetchNotificationEnd,
  fetchNotificationFailure,
  fetchNotificationStart,
  setNotifications,
} from "../../store/features/notificationsSlice";
import {
  fetchEnd,
  fetchFailure,
  fetchStart,
  setUsers,
} from "../../store/features/authSlice";

import {
  fetchDemandeEnd,
  fetchDemandeFailure,
  fetchDemandeStart,
  setDemandes,
} from "../../store/features/demandeSlice";
import {
  fetchMissionEnd,
  fetchMissionFailure,
  fetchMissionStart,
  setMissions,
} from "../../store/features/missionSlice";
import {
  fetchOmsEnd,
  fetchOmsFailure,
  fetchOmsStart,
  setOms,
} from "../../store/features/omsSlice";
import {
  fetchRfmsEnd,
  fetchRfmsFailure,
  fetchRfmsStart,
  setRfms,
} from "../../store/features/rfmsSlice";
import {
  fetchStatEnd,
  fetchStatFailure,
  fetchStatStart,
  setFilesKpis,
  setMissionKpis,
} from "../../store/features/statSlice";
import {
  fetchTicketEnd,
  fetchTicketFailure,
  fetchTicketStart,
  setTickets,
} from "../../store/features/ticketSlice";
import { apiService } from "../apiService";

const fetchData = async (
  dispatch,
  endpoint,
  socketEvent,
  startAction,
  failureAction,
  endAction
) => {
  dispatch(startAction());
  try {
    const res = await apiService.user.get(endpoint);
    // console.log(endpoint);
    const eventToActionMap = {
      mission: setMissions,
      om: setOms,
      rfm: setRfms,
      demande: setDemandes,
      user: setUsers,
      missionkpi: setMissionKpis,
      filekpi: setFilesKpis,
      notification: setNotifications,
      ticket: setTickets,
    };
    const setDataFunc = eventToActionMap[socketEvent];
    // console.log(res.data);
    dispatch(setDataFunc(res.data));

    dispatch(endAction());
  } catch (err) {
    console.log(`ERROR getting ${endpoint}: ${err}`);
    dispatch(failureAction());
  }
};

export const getMissions = (dispatch) => {
  fetchData(
    dispatch,
    "/mission/",
    "mission",
    fetchMissionStart,
    fetchMissionFailure,
    fetchMissionEnd
  );
  // getMissionKPIS(dispatch, 1);
};

export const getDemandes = (dispatch) => {
  fetchData(
    dispatch,
    "/demande/",
    "demande",
    fetchDemandeStart,
    fetchDemandeFailure,
    fetchDemandeEnd
  );
  // getFileKPIS(dispatch, 1);
};

export const getRFMs = (dispatch) => {
  fetchData(
    dispatch,
    "/rapportFM/",
    "rfm",
    fetchRfmsStart,
    fetchRfmsFailure,
    fetchRfmsEnd
  );
  // getFileKPIS(dispatch, 1);
};

export const getOMs = (dispatch) => {
  fetchData(
    dispatch,
    "/ordremission/",
    "om",
    fetchOmsStart,
    fetchOmsFailure,
    fetchOmsEnd
  );
  // getFileKPIS(dispatch, 1);
};

export const getUsers = (dispatch) => {
  fetchData(
    dispatch,
    "/auth/users",
    "user",
    fetchStart,
    fetchFailure,
    fetchEnd
  );
};
export const getMissionKPIS = (dispatch) => {
  fetchData(
    dispatch,
    "/kpis/mission",
    "missionkpi",
    fetchStatStart,
    fetchStatFailure,
    fetchStatEnd
  );
};
export const getFileKPIS = (dispatch) => {
  fetchData(
    dispatch,
    "/kpis/file",
    "filekpi",
    fetchStatStart,
    fetchStatFailure,
    fetchStatEnd
  );
};
export const getNotifications = (dispatch) => {
  fetchData(
    dispatch,
    "/notification/",
    "notification",
    fetchNotificationStart,
    fetchNotificationFailure,
    fetchNotificationEnd
  );
};
export const getTickets = (dispatch) => {
  fetchData(
    dispatch,
    "/ticket/",
    "ticket",
    fetchTicketStart,
    fetchTicketFailure,
    fetchTicketEnd
  );
};
export const getBestEmployes = async (endpoint) => {
  const res = await apiService.user.get(endpoint);
  // console.log(res.data);
  return res.data;
};
