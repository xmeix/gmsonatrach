import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import GestionEmploye from "./pages/profilAdmin/gestionEmployes/GestionEmploye";
import GestionMission from "./pages/profilAdmin/gestionMissions/GestionMission";
import GestionRelex from "./pages/profilAdmin/gestionRelex/GestionRelex";
import LoginPage from "./pages/loginPage/LoginPage";
import GestionCMR from "./pages/profilAdmin/gestionCMR/GestionCMR";
import Planning from "./pages/profilAdmin/planning/Planning";

function App() {
  const loggedIn = true;
  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gestion-des-mission" element={<GestionMission />} />
        <Route path="/gestion-des-employes" element={<GestionEmploye />} />
        <Route path="/suivi-depense" element={<GestionMission />} />
        <Route path="/gestion-service-relex" element={<GestionRelex />} />
        <Route path="/gestion-c-m-rfm" element={<GestionCMR />} />
        <Route path="/planification" element={<Planning />} />
      </Routes>
    </div>
  );
}

export default App;
