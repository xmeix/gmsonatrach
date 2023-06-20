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
  getNotifications,
  getTickets,
  getMissionKPIS,
  getFileKPIS,
} from "./api/apiCalls/getCalls";
import FilesDashboard from "./pages/profilAdmin/Dashboards/FilesDashboard";

const Planning = lazy(() => import("./pages/planning/Planning"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const EmployeesList = lazy(() => import("./pages/Listes/EmployeesList"));
const EmployeesForm = lazy(() => import("./pages/Forms/EmployeesForm"));
const UploadUsers = lazy(() => import("./pages/profilAdmin/UploadUsers"));
const DbsList = lazy(() => import("./pages/Listes/DbsList"));
const DbsImport = lazy(() => import("./pages/Imports/DbsImport"));
const DbsForm = lazy(() => import("./pages/Forms/DbsForm"));
const MissionList = lazy(() => import("./pages/Listes/MissionList"));
const OmsList = lazy(() => import("./pages/Listes/OmsList"));
const MissionForm = lazy(() => import("./pages/Forms/MissionForm"));
const MissionImport = lazy(() => import("./pages/Imports/MissionImport"));
const DmcList = lazy(() => import("./pages/Listes/DmcList"));
const RfmsList = lazy(() => import("./pages/Listes/RfmsList"));
const DcForm = lazy(() => import("./pages/Forms/DcForm"));
const DmList = lazy(() => import("./pages/Listes/DmList"));
const DmForm = lazy(() => import("./pages/Forms/DmForm"));
const DcList = lazy(() => import("./pages/Listes/DcList"));
const GestionTicket = lazy(() => import("./pages/profilAdmin/GestionTicket"));
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const MissionDashboard = lazy(() =>
  import("./pages/profilAdmin/Dashboards/MissionDashboard")
);
export const socket = io("http://localhost:3001");
// Define reusable arrays for route configurations based on user roles

export const mainDirRoutes = [
  { path: "/", element: <MissionDashboard />, title: "Tableau de bord" },
  { path: "/planification", element: <Planning />, title: "Planification" },
  {
    path: "/gestion-des-employes",
    title: "Employés",
    element: <EmployeesList />,
    subroutes: [
      { path: "", title: "Liste des employés", element: <EmployeesList /> },
      {
        path: "/user-form",
        title: "Ajouter utilisateur",
        element: <EmployeesForm />,
      },
      {
        path: "/user-import",
        title: "Ajouter plusieurs utilisateurs",
        element: <UploadUsers />,
      },
    ],
  },
  {
    path: "/service-relex",
    title: "Service Relex",
    element: <DbsList />,
    subroutes: [
      { path: "", element: <DbsList />, title: "Demandes de billetterie" },
      {
        path: "/dbs-form",
        element: <DbsForm />,

        title: "Ajouter une demande de billetterie",
      },
      {
        path: "/dbs-import",
        element: <DbsImport />,

        title: "Ajouter plusieurs demandes de billetterie",
      },
    ],
  },
  {
    path: "/gestion-des-mission",
    title: "Missions",
    element: <MissionList />,
    subroutes: [
      { path: "", element: <MissionList />, title: "Missions" },
      { path: "/oms", element: <OmsList />, title: "Ordres des missions" },
      {
        path: "/missions-form",
        element: <MissionForm />,
        title: "Formulaire d'ajout Mission",
      },
      {
        path: "/missions-import",
        element: <MissionImport />,
        title: "Importer plusieurs missions",
      },
    ],
  },
  {
    title: "Congé et Rapports",
    path: "/gestion-c-m-rfm",
    element: <DmcList />,
    subroutes: [
      {
        path: "",
        element: <DmcList />,
        title: "Demandes de congés et modification",
      },
      {
        path: "/rfms",
        element: <RfmsList />,
        title: "Rapports de fin de mission",
      },
    ],
  },
];
export const mainResRoutes = [
  { path: "/profile", element: <Profile />, title: "Mon Profile" },
  { path: "/", element: <MissionDashboard />, title: "Tableau de bord" },
  { path: "/planification", element: <Planning />, title: "Planification" },
  {
    path: "/gestion-des-employes",
    title: "Employés",
    element: <EmployeesList />,
    subroutes: [
      { path: "", title: "Liste des employés", element: <EmployeesList /> },
      {
        path: "/user-form",
        title: "formulaire d'ajout d'utilisateur",
        element: <EmployeesForm />,
      },
      {
        path: "/user-import",
        title: "Importer plusieurs utilisateurs",
        element: <UploadUsers />,
      },
    ],
  },
  {
    path: "/service-relex",
    title: "Service Relex",
    element: <DbsList />,
    subroutes: [
      { path: "", element: <DbsList />, title: "Demandes de billetterie" },
      {
        path: "/dbs-form",
        element: <DbsForm />,
        title: "formulaire d'ajout d'une demande de billetterie",
      },
      {
        path: "/dbs-import",
        element: <DbsImport />,
        title: "Importer plusieurs demandes de billetterie",
      },
    ],
  },
  {
    path: "/gestion-des-mission",
    title: "Missions",
    element: <MissionList />,
    subroutes: [
      { path: "", element: <MissionList />, title: "Missions" },
      { path: "/oms", element: <OmsList />, title: "Ordres des missions" },
      {
        path: "/missions-form",
        element: <MissionForm />,
        title: "Formulaire d'ajout Mission",
      },
      {
        path: "/missions-import",
        element: <MissionImport />,
        title: "Importer plusieurs missions",
      },
    ],
  },
  {
    title: "Congé et Rapports",
    path: "/gestion-c-m-rfm",
    element: <DmcList />,
    subroutes: [
      {
        path: "",
        element: <DmcList />,
        title: "Demandes de congés et modification",
      },
      {
        path: "/dc-form",
        element: <DcForm />,
        title: "Formulaire demande de congé",
      },
      {
        path: "/rfms",
        element: <RfmsList />,
        title: "Rapports de fin de mission",
      },
    ],
  },
];
export const mainSecRoutes = [
  { path: "/profile", element: <Profile />, title: "Mon Profile" },
  { path: "/", element: <Planning />, title: "Planification" },
  {
    path: "/gestion-des-employes",
    title: "Employés",
    element: <EmployeesList />,
    subroutes: [
      { path: "", title: "Liste des employés", element: <EmployeesList /> },
      {
        path: "/user-form",
        title: "formulaire d'ajout d'utilisateur",
        element: <EmployeesForm />,
      },
      {
        path: "/user-import",
        title: "Importer plusieurs utilisateurs",
        element: <UploadUsers />,
      },
    ],
  },
  {
    path: "/service-relex",
    title: "Service Relex",
    element: <DbsList />,
    subroutes: [
      { path: "", element: <DbsList />, title: "Demandes de billetterie" },
      {
        path: "/dbs-form",
        element: <DbsForm />,
        title: "formulaire d'ajout d'une demande de billetterie",
      },
      {
        path: "/dbs-import",
        element: <DbsImport />,
        title: "Importer plusieurs demandes de billetterie",
      },
    ],
  },
  {
    path: "/gestion-des-mission",
    title: "Missions",
    element: <MissionList />,
    subroutes: [
      { path: "", element: <MissionList />, title: "Missions" },
      { path: "/oms", element: <OmsList />, title: "Ordres des missions" },
      {
        path: "/missions-form",
        element: <MissionForm />,
        title: "Formulaire d'ajout Mission",
      },
      {
        path: "/missions-import",
        element: <MissionImport />,
        title: "Importer plusieurs missions",
      },
    ],
  },
  {
    title: "Congé et Rapports",
    path: "/gestion-c-m-rfm",
    element: <DmcList />,
    subroutes: [
      {
        path: "",
        element: <DmcList />,
        title: "Demandes de congés et modification",
      },
      {
        path: "/dc-form",
        element: <DcForm />,
        title: "Formulaire demande de congé",
      },
      {
        path: "/rfms",
        element: <RfmsList />,
        title: "Rapports de fin de mission",
      },
    ],
  },
];
export const mainRelexRoutes = [
  { path: "/profile", element: <Profile />, title: "Mon Profile" },
  {
    path: "/",
    title: "Liste des demandes de billetterie",
    element: <DbsList />,
  },
];
export const mainEmpRoutes = [
  { path: "/profile", element: <Profile />, title: "Mon Profile" },
  { path: "/", element: <Planning />, title: "Planification" },
  {
    path: "/gestion-des-mission",
    title: "Missions",
    element: <MissionList />,
    subroutes: [
      { path: "", element: <MissionList />, title: "Missions" },
      { path: "/oms", element: <OmsList />, title: "Ordres des missions" },
      {
        path: "/rfms",
        element: <RfmsList />,
        title: "Rapports de fin de mission",
      },
    ],
  },
  {
    title: "demandes de modification",
    path: "/gestion-modification",
    element: <DmList />,
    subroutes: [
      {
        path: "",
        element: <DmList />,
        title: "Demandes de modification",
      },
      {
        path: "/dm-form",
        element: <DmForm />,
        title: "Formulaire demande de modification",
      },
    ],
  },
  {
    title: "Tickets",
    path: "/gestion-ticket",
    element: <GestionTicket />,
  },
  {
    title: "demandes de congé",
    path: "/gestion-congés",
    element: <DcList />,
    subroutes: [
      {
        path: "",
        element: <DcList />,
        title: "Demandes de congé",
      },
      {
        path: "/dc-form",
        element: <DcForm />,
        title: "Formulaire demande de congé",
      },
    ],
  },
];

function App() {
  const dispatch = useDispatch();
  const { user, token, users, isLoggedIn } = useSelector((state) => state.auth);
  const { missions } = useSelector((state) => state.mission);

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
  //   .filter((u) => ["employe"].includes(u.role))
  //   .map((u) => u._id);
  // console.log(JSON.stringify(employees));

  // const employees = missions
  //   .filter((u) => u.etat==="terminée")
  //   .map((u) => u._id);
  // console.log(JSON.stringify(employees));

  // removed useCallback
  const handleSocketConnection = () => {
    socket.on("ticket", handleTicket);
    socket.on("getMissions", handleGetMissions);
    socket.on("getOms", handleGetOMs);
    socket.on("getDemandes", handleGetDemandes);
    socket.on("getRfms", handleGetRFMs);
    socket.on("getUsers", handleGetUsers);
    socket.on("notification", handleNotification);
    socket.on("getMissionKPIs", handleGetMissionKpis);
    socket.on("getFileKPIs", handleGetFileKpis);
  };

  const handleSocketDisconnection = () => {
    socket.off("ticket", handleTicket);
    socket.off("getMissions", handleGetMissions);
    socket.off("getOms", handleGetOMs);
    socket.off("getDemandes", handleGetDemandes);
    socket.off("getRfms", handleGetRFMs);
    socket.off("getUsers", handleGetUsers);
    socket.off("notification", handleNotification);
    socket.off("getMissionKPIs", handleGetMissionKpis);
    socket.off("getFileKPIs", handleGetFileKpis);
  };

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
  const handleGetMissionKpis = useCallback(
    (tab) => {
      if (tabId === tab) {
        getMissionKPIS(dispatch);
      }
    },
    [dispatch, tabId]
  );
  const handleGetFileKpis = useCallback(
    (tab) => {
      if (tabId === tab) {
        getFileKPIS(dispatch);
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
      if (user._id.toString() === userId.toString() && isLoggedIn) {
        if (user.role !== "relex") {
          getMissions(dispatch);
          getRFMs(dispatch);
          getOMs(dispatch);
        }
        getDemandes(dispatch);
        getNotifications(dispatch);
        if (user.role !== "relex" && user.role !== "employe") {
          getUsers(dispatch);
        }
        if (user.role !== "relex" && user.role !== "secretaire") {
          getTickets(dispatch);
        }

        if (
          user.role !== "relex" &&
          user.role !== "employe" &&
          user.role !== "secretaire"
        ) {
          getMissionKPIS(dispatch);
          getFileKPIS(dispatch);
        }
      }
    };

    if (isLoggedIn) {
      socket.emit("login", user, token, tabId);
      localStorage.setItem("isLoggedIn", true);
      handleSocketConnection();
      socket.on("loginData", handleLoginData);
    } else {
      localStorage.setItem("isLoggedIn", false);
      socket.off("loginData", handleLoginData);
      handleSocketDisconnection();
    }
    socket.on("sessionExpired", handleRefreshPage);

    return () => {
      socket.off("loginData", handleLoginData);
      socket.off("sessionExpired", handleRefreshPage);
    };
  }, [isLoggedIn]);

  // useEffect(() => {
  //   return () => {
  //     handleSocketDisconnection();
  //   };
  // }, []);

  const handleStorageChange = (event) => {
    if (event.key === "isLoggedIn") {
      // if (event.newValue === "true") {
      console.log("refreshed");
      handleRefreshPage();
      // }
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
      case "directeur":
        routes = mainDirRoutes;
        break;
      case "responsable":
        routes = mainResRoutes;
        break;

      case "secretaire":
        routes = mainSecRoutes;
        break;
      case "relex":
        routes = mainRelexRoutes;
        break;
      case "employe":
        routes = mainEmpRoutes;
        break;

      default:
        break;
    }
  }

  const isAlreadyLoggedIn = isLoggedIn && location.pathname === "/";
  const loginPath = "/"; // Replace with your actual login path
  const subroutes = routes.reduce((acc, route) => {
    if (route.subroutes) {
      route.subroutes.forEach((subroute) => {
        acc.push({
          path: route.path + subroute.path,
          element: subroute.element,
        });
      });
    }
    return acc;
  }, []);
  return (
    <div className="app">
      {isLoggedIn && <NavBar />}
      <Suspense fallback={<Loading />}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {subroutes.map((subroute, index) => (
            <Route
              key={index}
              path={subroute.path}
              element={subroute.element}
            />
          ))}
          {!isAlreadyLoggedIn && (
            <Route path="*" element={<Navigate to={loginPath} />} />
          )}
          {isLoggedIn &&
            (user.role === "responsable" || user.role === "directeur") && (
              <Route path="/files-analytics" element={<FilesDashboard />} />
            )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
