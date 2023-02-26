import { Route, Routes } from "react-router-dom";
import "./App.css";
import Liste from "./components/liste/Liste";
import NavBar from "./components/navbar/NavBar";
import PageName from "./components/pageName/PageName";
import GestionEmploye from "./pages/gestionEmployes/GestionEmploye";
import GestionMission from "./pages/gestionMissions/GestionMission";
import GestionRelex from "./pages/gestionRelex/GestionRelex";
import LoginPage from "./pages/loginPage/LoginPage";
import SuiviDepense from "./pages/suiviDepense/SuiviDepense";

function App() {
  const loggedIn = true;
  return (
    <div className="app">
      {loggedIn && <NavBar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gestion-des-mission" element={<GestionMission />} />
        <Route path="/gestion-des-employes" element={<GestionEmploye />} />
        <Route path="/suivi-depense" element={<GestionMission />} />
        <Route path="/gestion-service-relex" element={<GestionRelex />} />
      </Routes>
    </div>
  );
}

export default App;
