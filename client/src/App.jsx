import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import Dashboard from "./pages/profilAdmin/Dashboard";
import LoginPage from "./pages/loginPage/LoginPage";
import GestionMission from "./pages/profilAdmin/GestionMission";
import GestionEmploye from "./pages/profilAdmin/GestionEmploye";
import GestionRelex from "./pages/profilAdmin/GestionRelex";
import GestionCMR from "./pages/profilAdmin/GestionCMR";
import Planning from "./pages/planning/Planning";

import { useSelector } from "react-redux";
import Formulaire from "./components/formulaire/Formulaire";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div className="app">
      {/* <Formulaire /> */}
      {isLoggedIn && <NavBar />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <LoginPage />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <LoginPage />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/gestion-des-mission"
          element={isLoggedIn ? <GestionMission /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/gestion-des-employes"
          element={isLoggedIn ? <GestionEmploye /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/suivi-depense"
          element={isLoggedIn ? <GestionMission /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/gestion-service-relex"
          element={isLoggedIn ? <GestionRelex /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/gestion-c-m-rfm"
          element={isLoggedIn ? <GestionCMR /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/planification"
          element={isLoggedIn ? <Planning /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
