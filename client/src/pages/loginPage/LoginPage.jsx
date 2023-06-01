import "./LoginPage.css";
import logo from "../../assets/logo.svg";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import { InputAdornment } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { useState } from "react";
import { useAxios } from "../../hooks/useAxios";
import "./../../components/formulaire/Formulaire.css";

const LoginPage = () => {
  const entries = [
    { name: "email", label: "Adresse e-mail" },
    { name: "password", label: "Mot de passe" },
  ];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { callApi, error, isLoading, successMsg } = useAxios();
  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      const newErrors = {};

      if (/\s/.test(email)) {
        newErrors.email = "L'email ne doit pas contenir d'espaces.";
        setErrors(newErrors);
      } else if (
        !/^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*@sonatrach\.dz$/.test(email)
      ) {
        newErrors.email = "E-mail invalide.";
        setErrors(newErrors);
      } else {
        const userAuth = {
          email: email,
          password,
        };
        callApi("post", "/auth/login", { email, password });
        if (error) {
          setErrors({
            email: "E-mail invalide",
            password: "Mot de passe invalide",
          });
        } else {
          setPassword("");
          setEmail("");
          setErrors({});
        }
      }
    } else {
      const newErrors = {};
      if (email === "") {
        newErrors.email = "obligatoire";
      }
      if (password === "") {
        newErrors.password = "obligatoire";
      }
      setErrors(newErrors);
      console.log(errors);
    }
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
        <p className="formLTitle">
          <span>SH-Missions</span> <br />
          page de connexion
        </p>

        {entries.map((entry, index) => (
          <div className="inpabel" style={{ position: "relative" }} key={index}>
            <label htmlFor={entry}>{entry.label}</label>
            <InputAdornment
              position="start"
              style={{
                position: "absolute",
                top: "2.6em",
                left: "0.5em",
              }}
            >
              {entry.name === "password" ? (
                <LockRoundedIcon className="icn" />
              ) : (
                <AlternateEmailRoundedIcon className="icn" />
              )}
            </InputAdornment>
            <input
              type={entry.name}
              name={entry.name}
              placeholder={entry.label}
              value={entry.name === "email" ? email : password}
              onChange={
                entry.name === "email"
                  ? handleEmailChange
                  : handlePasswordChange
              }
              style={{ paddingLeft: "30px" }}
            />
            {errors[entry.name] && (
              <div className="input-error" style={{ alignSelf: "flex-end" }}>
                {errors[entry.name]}
              </div>
            )}
            {/* {error && <div className="input-error">{error}</div>} */}
          </div>
        ))}
        <button
          type="submit"
          className="LBtn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          se connecter
        </button>
      </form>
      {successMsg && <div className="success-message">{successMsg}</div>}
    </div>
  );
};

export default LoginPage;
