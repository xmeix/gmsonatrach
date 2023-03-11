import bcrypt from "bcrypt";
import { generateJWT } from "../middleware/auth.js";
import User from "../models/User.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";

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

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const jwtToken = generateJWT(
      user,
      "15m" /*15min apres*/,
      process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = generateJWT(
      user,
      "1d", //15min apres
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, // should be true in production https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    delete user.password;
    res.status(200).json({ token: jwtToken, user, msg: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** LOGOUT */
export const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).send();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ msg: "Logged out successfully and Cookie cleared" });
};

export const refresh = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(403).json({ error: "cookie not found" });
  }
  const refreshToken = cookies.jwt;
  //we need to get the refresh token , if found and not expired than continue else ERROR
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // If refresh token is expired, log out the user
          return logout(req, res);
        }
        return res.status(403).json({ msg: "Forbidden" });
      }
      const foundUser = await User.findById(decoded.UserInfo.id);
      if (!foundUser) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const accessToken = generateJWT(
        foundUser,
        "15m",
        process.env.ACCESS_TOKEN_SECRET
      );
       
      res.set("Authorization", `Bearer ${accessToken}`);

      next();
    }
  );
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const currUser = await User.findById(req.user.id);

    let filteredUsers;

    if (currUser.role === "relex" || currUser.role === "employe")
      throw new Error("Unauthorized");
    else if (currUser.role === "responsable") {
      filteredUsers = users.filter(
        (user) => user.structure === req.user.structure
      );
    } else filteredUsers = users;
    res.status(200).json(filteredUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
