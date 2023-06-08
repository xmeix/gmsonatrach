import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "./components/loading/Loading";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import {
  getDemandes,
  getUsers,
  getRFMs,
  getOMs,
  getMissions,
  getMissionKPIS,
  getFileKPIS,
  getNotifications,
  getTickets,
} from "./api/apiCalls/getCalls";
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const CostDashboard = lazy(() =>
  import("./pages/profilAdmin/Dashboards/CostDashboard")
);
const FilesDashboard = lazy(() =>
  import("./pages/profilAdmin/Dashboards/FilesDashboard")
);
const UsersDashboard = lazy(() =>
  import("./pages/profilAdmin/Dashboards/UsersDashboard")
);
const MissionDashboard = lazy(() =>
  import("./pages/profilAdmin/Dashboards/MissionDashboard")
);
const GestionMission = lazy(() => import("./pages/profilAdmin/GestionMission"));
const GestionEmploye = lazy(() => import("./pages/profilAdmin/GestionEmploye"));
const GestionRelex = lazy(() => import("./pages/profilAdmin/GestionRelex"));
const GestionCMR = lazy(() => import("./pages/profilAdmin/GestionCMR"));
const Planning = lazy(() => import("./pages/planning/Planning"));
const GestionTicket = lazy(() => import("./pages/profilAdmin/GestionTicket"));
const GestionModification = lazy(() =>
  import("./pages/profilEmploye/GestionModification")
);
const GestionConge = lazy(() => import("./pages/profilEmploye/GestionConge"));

export const socket = io("http://localhost:3001");
// Define reusable arrays for route configurations based on user roles
const adminRoutes = [
  { path: "/", element: <MissionDashboard /> },
  { path: "/planification", element: <Planning /> },
  { path: "/users-analytics", element: <UsersDashboard /> },
  { path: "/files-analytics", element: <FilesDashboard /> },
  { path: "/cost-analytics", element: <CostDashboard /> },
  { path: "/gestion-des-mission", element: <GestionMission /> },
  { path: "/gestion-des-employes", element: <GestionEmploye /> },
  { path: "/gestion-service-relex", element: <GestionRelex /> },
  { path: "/gestion-c-m-rfm", element: <GestionCMR /> },
];

//this would only appear if a mission is "en-cours"
const employeRoutes = [
  { path: "/", element: <Planning /> },
  { path: "/gestion-des-mission", element: <GestionMission /> },
  { path: "/gestion-modification", element: <GestionModification /> },
  { path: "/gestion-conge", element: <GestionConge /> },
  { path: "/gestion-tickets", element: <GestionTicket /> },
];

const secretaireRoutes = [
  { path: "/", element: <Planning /> },
  { path: "/gestion-des-mission", element: <GestionMission /> },
  { path: "/gestion-des-employes", element: <GestionEmploye /> },
  { path: "/gestion-service-relex", element: <GestionRelex /> },
  { path: "/gestion-c-m-rfm", element: <GestionCMR /> },
];

const relexRoutes = [{ path: "/", element: <GestionRelex /> }];

function App() {
  const dispatch = useDispatch();
  const { user, missions, token, users, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const handleRefreshPage = () => {
    window.location.reload();
  };

  let tabId = window.name;
  if (!tabId) {
    // Generate a new UUID if it doesn't exist in window.name
    tabId = uuidv4();
    // Store the generated UUID in the window.name property
    window.name = tabId;
    handleRefreshPage();
  }
  // console.log(tabId);

  // const employees = users
  //   .filter((u) => ["responsable", "directeur", "secretaire"].includes(u.role))
  //   .map((u) => u._id);
  // console.log(JSON.stringify(employees));

  // const employees = missions
  //   .filter((u) => u.etat==="terminée")
  //   .map((u) => u._id);
  // console.log(JSON.stringify(employees));

  const handleSocketConnection = useCallback(() => {
    socket.on("ticket", handleTicket);
    socket.on("getMissions", handleGetMissions);
    socket.on("getOms", handleGetOMs);
    socket.on("getDemandes", handleGetDemandes);
    socket.on("getRfms", handleGetRFMs);
    socket.on("getUsers", handleGetUsers);
    socket.on("notification", handleNotification);
  }, []);

  const handleSocketDisconnection = useCallback(() => {
    socket.off("ticket", handleTicket);
    socket.off("getMissions", handleGetMissions);
    socket.off("getOms", handleGetOMs);
    socket.off("getDemandes", handleGetDemandes);
    socket.off("getRfms", handleGetRFMs);
    socket.off("getUsers", handleGetUsers);
    socket.off("notification", handleNotification);
  }, []);

  const handleTicket = useCallback(
    (tab) => {
      if (tabId === tab) {
        getTickets(dispatch);
      }
    },
    [dispatch, tabId]
  );

  const handleGetMissions = useCallback(
    (tab) => {
      if (tabId === tab) {
        getMissions(dispatch);
      }
    },
    [dispatch, tabId]
  );

  const handleGetOMs = useCallback(
    (tab) => {
      if (tabId === tab) {
        getOMs(dispatch);
      }
    },
    [dispatch, tabId]
  );

  const handleGetDemandes = useCallback(
    (tab) => {
      if (tabId === tab) {
        getDemandes(dispatch);
      }
    },
    [dispatch, tabId]
  );

  const handleGetRFMs = useCallback(
    (tab) => {
      if (tabId === tab) {
        getRFMs(dispatch);
      }
    },
    [dispatch, tabId]
  );

  const handleGetUsers = useCallback(
    (tab) => {
      if (tabId === tab) {
        getUsers(dispatch);
      }
    },
    [dispatch, tabId]
  );

  const handleNotification = useCallback(
    (tab) => {
      if (tabId === tab) {
        getNotifications(dispatch);
      }
    },
    [dispatch, tabId]
  );
  useEffect(() => {
    const handleLoginData = async (userId) => {
      if (user._id.toString() === userId.toString()) {
        if (user.role !== "relex") {
          getMissions(dispatch);
          getRFMs(dispatch);
          getOMs(dispatch);
          getTickets(dispatch);
        }
        getDemandes(dispatch);
        getNotifications(dispatch);
        if (user.role !== "relex" && user.role !== "employe") {
          getUsers(dispatch);
        }
      }
    };

    if (isLoggedIn) {
      socket.emit("login", user, token, tabId);
      localStorage.setItem("isLoggedIn", true);
      handleSocketConnection();
      socket.on("loginData", handleLoginData);
    } else {
      socket.off("loginData", handleLoginData);
      localStorage.removeItem("isLoggedIn");
    }

    socket.on("sessionExpired", handleRefreshPage);

    return () => {
      socket.off("loginData", handleLoginData);
      socket.off("sessionExpired", handleRefreshPage);
      handleSocketDisconnection();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      handleSocketDisconnection();
    };
  }, []);

  const handleStorageChange = (event) => {
    if (event.key === "isLoggedIn") {
      if (event.newValue === "true") {
        console.log("refreshed");

        handleRefreshPage();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  let routes = [];

  if (!isLoggedIn) {
    routes = [{ path: "/", element: <LoginPage /> }];
  } else {
    switch (user?.role) {
      case "employe":
        routes = employeRoutes;
        break;
      case "secretaire":
        routes = secretaireRoutes;
        break;
      case "responsable":
      case "directeur":
        routes = [...adminRoutes, ...secretaireRoutes];
        break;
      case "relex":
        routes = relexRoutes;
        break;
      default:
        break;
    }
  }

  const isAlreadyLoggedIn = isLoggedIn && location.pathname === "/";
  const loginPath = "/"; // Replace with your actual login path

  return (
    <div className="app">
      {isLoggedIn && <NavBar />}
      <Suspense fallback={<Loading />}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {!isAlreadyLoggedIn && (
            <Route path="*" element={<Navigate to={loginPath} />} />
          )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
