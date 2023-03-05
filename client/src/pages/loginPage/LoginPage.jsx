import "./LoginPage.css";
import logo from "../../assets/logo.svg";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import { InputAdornment } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { useState } from "react";
import { useAxios } from "../../hooks/useAxios";

const LoginPage = () => {
  const entries = ["email", "password"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { callApi, error, isLoading, successMsg } = useAxios();
  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
    //login(email, password);
    callApi("post", "/auth/login", { email, password });
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
        <button
          type="submit"
          className="LBtn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          Log in
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}
    </div>
  );
};

export default LoginPage;
