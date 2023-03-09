import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import Dashboard from "./pages/profilAdmin/Dashboard";
import LoginPage from "./pages/loginPage/LoginPage";
import GestionMission from "./pages/profilAdmin/GestionMission";
import GestionEmploye from "./pages/profilAdmin/GestionEmploye";
import GestionRelex from "./pages/profilAdmin/GestionRelex";
import GestionCMR from "./pages/profilAdmin/GestionCMR";
import Planning from "./pages/planning/Planning";

import { useDispatch, useSelector } from "react-redux";
import Formulaire from "./components/formulaire/Formulaire";
import { apiService } from "./api/apiService";
import { useEffect } from "react";
import { setLogin, setToken } from "./store/features/authSlice";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (isLoggedIn) {
          const res = await apiService.user.get("/auth/refresh");
          dispatch(setToken(res.data.token));
        }
      } catch (error) {
        console.error(error);
      }
    }, 36000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      {/* <Formulaire /> */}
      {isLoggedIn && <NavBar />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <LoginPage />} />
        <Route
          path="/tableau-de-bord"
          element={isLoggedIn ? <Dashboard /> : <LoginPage />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage /> : <Dashboard />}
        />
        <Route
          path="/gestion-des-mission"
          element={isLoggedIn ? <GestionMission /> : <LoginPage />}
        />
        <Route
          path="/gestion-des-employes"
          element={isLoggedIn ? <GestionEmploye /> : <LoginPage />}
        />
        <Route
          path="/suivi-depense"
          element={isLoggedIn ? <GestionMission /> : <LoginPage />}
        />
        <Route
          path="/gestion-service-relex"
          element={isLoggedIn ? <GestionRelex /> : <LoginPage />}
        />
        <Route
          path="/gestion-c-m-rfm"
          element={isLoggedIn ? <GestionCMR /> : <LoginPage />}
        />
        <Route
          path="/planification"
          element={isLoggedIn ? <Planning /> : <LoginPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
