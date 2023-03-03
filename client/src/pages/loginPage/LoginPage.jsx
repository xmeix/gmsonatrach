import "./LoginPage.css";
import logo from "../../assets/logo.svg";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import { InputAdornment } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const LoginPage = () => {
  const { login } = useAuth();
  const entries = ["email", "password"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  return (
    <div className="loginPage">
      <img src={logo} className="logo" alt="" />
      <form className="formL">
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
              value={entry === "email" ? email : password}
              onChange={
                entry === "email" ? handleEmailChange : handlePasswordChange
              }
              style={{ paddingLeft: "30px" }}
            />
          </div>
        ))}
        <button type="submit" className="LBtn" onClick={handleLogin}>
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
