import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "./components/loading/Loading";
import { io } from "socket.io-client";
import {
  setDemandes,
  setDepenses,
  setMissions,
  setOMs,
  setRFMs,
  setUsers,
} from "./store/features/authSlice";
import {
  getDemandes,
  getUsers,
  getRFMs,
  getOMs,
  getMissions,
} from "./api/apiCalls/getCalls";
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const Dashboard = lazy(() => import("./pages/profilAdmin/Dashboard"));
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
  let element = null;
  const dispatch = useDispatch();

  const handleSocketData = (data, type) => {
    switch (type) {
      case "demande":
        dispatch(setDemandes(data));
        break;
      case "user":
        dispatch(setUsers(data));
        break;
      case "mission":
        dispatch(setMissions(data));
        break;
      case "rfm":
        dispatch(setRFMs(data));
        break;
      case "om":
        dispatch(setOMs(data));
        break;
      case "depense":
        dispatch(setDepenses(data));
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
      handleSocketConnection();
      return handleSocketDisconnection;
    }
  }, [isLoggedIn]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log("client side working now");
  //     getMissions(dispatch);
  //     getRFMs(dispatch);
  //   }, 60 * 1000); // 10000 milliseconds = 10 seconds

  //   return () => clearInterval(intervalId);
  // }, []);

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
        <Route path="/gestion-depenses" element={<div>TODO</div>} />
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
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/planification" element={<Planning />} />
        <Route path="/gestion-des-mission" element={<GestionMission />} />
        <Route path="/gestion-des-employes" element={<GestionEmploye />} />
        <Route path="/gestion-depenses" element={<GestionCMR />} />
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
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       if (isLoggedIn) {
  //         const res = await apiService.user.get("/auth/refresh");
  //         dispatch(setToken(res.data.token));
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }, 5 * 60 * 1000);

  //   return () => clearInterval(interval);
  // }, []);

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
