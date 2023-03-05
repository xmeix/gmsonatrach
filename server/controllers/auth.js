import bcrypt from "bcrypt";
import { generateJWT } from "../middleware/auth.js";
import User from "../models/User.js";
import cookie from "cookie";

/** REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      fonction,
      numTel,
      email,
      password,
      role,
      etat,
      structure,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const numTelRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (
      nom === "" ||
      prenom === "" ||
      fonction === "" ||
      numTel === "" ||
      email === "" ||
      password === "" ||
      role === "" ||
      etat === "" ||
      structure === ""
    )
      throw new Error("empty fields");
    else if (!numTelRegex.test(numTel)) {
      throw new Error("Invalid phone number");
    } else {
      const user = await User.findOne({ email: email });
      if (user) throw new Error("user already exists");
    }
    const newUser = new User({
      nom,
      prenom,
      fonction,
      numTel,
      email,
      password: passwordHash,
      role,
      etat,
      structure,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ savedUser, msg: "Registered Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** LOGIN USER */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Utilisateur non trouvé");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
    const token = generateJWT(user);

    res.cookie("jwt", token, {
      httpOnly: false,
      secure: true, //should be true in production
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    delete user.password;

    res.status(200).json({ token, user, msg: "Authentification avec succés" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** LOGOUT */
export const logout = async (req, res) => {
  // const cookies = cookie.parse(req.headers.cookie || "");
  // console.log(res.data);
  // if (!cookies.jwt) {
  //   return res.status(400).json({ error: "JWT cookie not found" });
  // }
  res.clearCookie("jwt");
  res.json({ msg: "Logged out successfully" });
};
