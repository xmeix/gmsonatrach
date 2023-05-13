import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import { lazy, Suspense } from "react";
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
const GestionModification = lazy(() =>
  import("./pages/profilEmploye/GestionModification")
);
const GestionConge = lazy(() => import("./pages/profilEmploye/GestionConge"));

export const socket = io("http://localhost:3001");

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.user);
  // const users = useSelector((state) => state.auth.users);
  let element = null;
  const dispatch = useDispatch();

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
    socket.on("updatedData", handleSocketData);
  };

  const handleSocketDisconnection = () => {
    socket.off("cronDataChange", handleCronData);
    socket.off("updatedData", handleSocketData);
  };

  useEffect(() => {
    if (isLoggedIn) {
      socket.emit("login", currentUser);
      handleSocketConnection();
    } else {
      socket.emit("logout");
    }

    return () => {
      handleSocketDisconnection();
    };
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    return () => {
      handleSocketDisconnection();
    };
  }, []);

  if (!isLoggedIn) {
    element = (
      <>
        <Route exact path="/" element={<LoginPage />} />{" "}
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  } else if (currentUser.role === "employe") {
    element = (
      <>
        <Route exact path="/" element={<Planning />} />
        <Route path="/gestion-des-mission" element={<GestionMission />} />
        <Route path="/gestion-modification" element={<GestionModification />} />
        <Route path="/gestion-conge" element={<GestionConge />} />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  } else if (
    currentUser.role === "responsable" ||
    currentUser.role === "secretaire" ||
    currentUser.role === "directeur"
  ) {
    element = (
      <>
        <Route exact path="/" element={<MissionDashboard />} />
        <Route exact path="/users-analytics" element={<UsersDashboard />} />
        <Route exact path="/files-analytics" element={<FilesDashboard />} />
        <Route exact path="/cost-analytics" element={<CostDashboard />} />
        <Route path="/planification" element={<Planning />} />
        <Route path="/gestion-des-mission" element={<GestionMission />} />
        <Route path="/gestion-des-employes" element={<GestionEmploye />} />
        <Route path="/gestion-service-relex" element={<GestionRelex />} />
        <Route path="/gestion-c-m-rfm" element={<GestionCMR />} />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  } else if (currentUser.role === "relex") {
    element = (
      <>
        <Route exact path="/" element={<GestionRelex />} />{" "}
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  }

  return (
    <div className="app">
      {/* <Formulaire /> */}
      {isLoggedIn && <NavBar />}
      <Suspense fallback={<Loading />}>
        <Routes>{element}</Routes>
      </Suspense>
    </div>
  );
}

export default App;
