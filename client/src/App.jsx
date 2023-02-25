import { Route, Routes } from "react-router-dom";
import "./App.css";
import Liste from "./components/liste/Liste";
import NavBar from "./components/navbar/NavBar";
import PageName from "./components/pageName/PageName";
import GestionMission from "./pages/gestionMissions/GestionMission";
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
        <Route path="/suivi-depense" element={<GestionMission />} />
      </Routes>
    </div>
  );
}

export default App;
