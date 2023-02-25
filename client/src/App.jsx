import "./App.css";
import Liste from "./components/liste/Liste";
import NavBar from "./components/navbar/NavBar";
import PageName from "./components/pageName/PageName";
import GestionMission from "./pages/gestionMissions/GestionMission";
import LoginPage from "./pages/loginPage/LoginPage";
import SuiviDepense from "./pages/suiviDepense/SuiviDepense";

function App() {
  return (
    <div className="app">
      <NavBar />
      <GestionMission />
    </div>
  );
}

export default App;
