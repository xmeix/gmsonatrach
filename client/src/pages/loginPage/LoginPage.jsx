import "./LoginPage.css";
import logo from "../../assets/logo.svg";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import { InputAdornment } from "@mui/material";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { NavLink } from "react-router-dom";
const LoginPage = () => {
  const entries = ["email", "password"];
  return (
    <div className="loginPage">
      <img src={logo} className="logo" alt="" />
      <div className="formL">
        <p className="formLTitle">Login</p>

        {entries.map((entry, index) => (
          <div className="inpabel" style={{ position: "relative" }} key={index}>
            <label htmlFor={entry}>{entry}</label>
            <InputAdornment
              position="start"
              style={{ position: "absolute", top: "2.7em", left: "0.5em" }}
            >
              {entry === "password" ? (
                <LockRoundedIcon className="icn" />
              ) : (
                <AlternateEmailRoundedIcon className="icn" />
              )}
            </InputAdornment>
            <input
              type={entry}
              name={entry}
              placeholder={entry}
              style={{ paddingLeft: "30px" }}
            />
          </div>
        ))}
        <NavLink to="/gestion-des-mission" style={{ textDecoration: "none" }}>
          <button type="submit" className="LBtn">
            Log in
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default LoginPage;
