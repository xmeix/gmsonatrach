import "./LoginPage.css";
import logo from "../../assets/logo.svg";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import { InputAdornment } from "@mui/material";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { NavLink } from "react-router-dom";
const LoginPage = () => {
  return (
    <div className="loginPage">
      <img src={logo} className="logo" alt="" />
      <div className="form">
        <p className="formTitle">Login</p>
        <div className="inpabel" style={{ position: "relative" }}>
          <label htmlFor="">e-mail</label>
          <input
            type="email"
            name="email"
            placeholder="email"
            style={{ paddingLeft: "30px" }}
          />
          <InputAdornment
            position="start"
            style={{ position: "absolute", top: "2.7em", left: "0.5em" }}
          >
            <AlternateEmailRoundedIcon className="icn" />
          </InputAdornment>
        </div>
        <div className="inpabel" style={{ position: "relative" }}>
          <label htmlFor="password">password</label>
          <InputAdornment
            position="start"
            style={{ position: "absolute", top: "2.7em", left: "0.5em" }}
          >
            <LockRoundedIcon className="icn" />
          </InputAdornment>
          <input
            type="password"
            name="password"
            placeholder="password"
            style={{ paddingLeft: "30px" }}
          />
        </div>
        <NavLink to="/gestion-des-mission">
          <button type="submit">Log in</button>
        </NavLink>
      </div>
    </div>
  );
};

export default LoginPage;
