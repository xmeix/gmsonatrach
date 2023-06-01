import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import { lazy, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "./components/loading/Loading";
import { io } from "socket.io-client";
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
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { user, missions, token } = useSelector((state) => state.auth);
  const [sessionExpired, setSessionExpired] = useState(false);
  const dispatch = useDispatch();

  const handleSessionExpired = () => {
    setSessionExpired(true);
  };

  // const users = useSelector((state) => state.auth.users);
  

  // const employees = users.map((u) => u._id);
  // console.log(JSON.stringify(employees));

  const handleSocketData = (type) => {
    switch (type) {
      case "demande":
        getDemandes(dispatch, 1);

        break;
      case "user":
        getUsers(dispatch, 1);

        break;
      case "mission":
        getMissions(dispatch, 1);
        getOMs(dispatch, 1);
        break;
      case "rfm":
        {
          getRFMs(dispatch, 1);
        }
        break;
      case "om":
        getOMs(dispatch, 1);
        break;
      case "missionkpi":
        getMissionKPIS(dispatch, 1);
        break;
      case "filekpi":
        getFileKPIS(dispatch, 1);
        break;
      case "notification":
        getNotifications(dispatch, 1);
        break;
      case "ticket":
        getTickets(dispatch, 1);
        break;
      default:
        break;
    }
  };
  const handleCronData = () => {
    console.log("inside the handle Cron data ==> appjs");
    getDemandes(dispatch);
    getRFMs(dispatch);
    getMissions(dispatch);
    getOMs(dispatch);
    getUsers(dispatch);
  };
  const handleSocketConnection = () => {
    socket.on("cronDataChange", handleCronData);
    socket.on("ticket", async () => {
      getTickets(dispatch, 1);
    });
    socket.on("updatedData", handleSocketData);
  };

  const handleSocketDisconnection = () => {
    socket.off("cronDataChange", handleCronData);
    socket.off("updatedData", handleSocketData);
  };
  const handleRefreshPage = () => {
    window.location.reload();
  };
  useEffect(() => {
    if (isLoggedIn) {
      socket.emit("login", user, token);
      localStorage.setItem("isLoggedIn", true);
      handleSocketConnection();
    } else {
      socket.emit("logout");
      localStorage.setItem("isLoggedIn", false);
    }
    socket.on("sessionExpired", handleRefreshPage);

    return () => {
      handleSocketDisconnection();
    };
  }, [isLoggedIn, user, token]);

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
  if (sessionExpired) {
    return (
      <div className="app">
        <p>
          Your session has expired. Please refresh the page or log in again.
        </p>
        <button onClick={handleRefreshPage}>Refresh Page</button>
      </div>
    );
  }
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
