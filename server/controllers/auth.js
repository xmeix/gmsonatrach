import bcrypt from "bcrypt";
import { generateJWT } from "../middleware/auth.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { io } from "../index.js";
import { emitData, generateCustomId } from "./utils.js";

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
      user,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    // const numTelRegex = /^(0)(5|6|7)[0-9]{8}$/;
    // if (
    //   nom === "" ||
    //   prenom === "" ||
    //   fonction === "" ||
    //   numTel === "" ||
    //   email === "" ||
    //   password === "" ||
    //   structure === ""
    // )
    //   throw new Error("empty fields");
    // else if (!numTelRegex.test(numTel)) {
    //   throw new Error("Invalid phone number");
    // } else {
    //   const user = await User.findOne({ email: email });
    //   if (user) throw new Error("user already exists");
    // }
    console.log(user.role);
    let customId;
    if (user.role === "relex") {
      customId = await generateCustomId("RELEX", "users");
    } else if (user.role === "responsable") {
      customId = await generateCustomId(user.structure, "users");
    } else customId = await generateCustomId(structure, "users");
    const newUser = new User({
      uid: customId,
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
    res.set("Authorization", `Bearer ${jwtToken}`);

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

/**
export const refresh = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      reject({ error: "cookie not found" });
    }
    const refreshToken = cookies.jwt;

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const foundUser = await User.findById(decoded.UserInfo.id);
      if (!foundUser) {
        reject({ error: "Unauthorized" });
      }
      const accessToken = generateJWT(
        foundUser,
        "15m",
        process.env.ACCESS_TOKEN_SECRET
      );
      resolve(accessToken);
    } catch (err) {
      console.error(err);
      if (err.name === "TokenExpiredError") {
        await logout(req, res);
        reject({ error: "Refresh token expired" });
      } else {
        reject({ error: "Invalid refresh token" });
      }
    }
  });
};

 */
export const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return Promise.reject({ error: "cookie not found" });
  }
  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const foundUser = await User.findById(decoded.UserInfo.id);
    if (!foundUser) {
      return Promise.reject({ error: "Unauthorized" });
    }
    const accessToken = generateJWT(
      foundUser,
      "15m",
      process.env.ACCESS_TOKEN_SECRET
    );
    return Promise.resolve(accessToken);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      await logout(req, res);
      return Promise.reject({ error: "Refresh token expired" });
    }
    return Promise.reject({ error: "Invalid refresh token" });
  }
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

export const deleteUser = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.remove();
    res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const alterUser = async (req, res) => {
  try {
    // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });
    const { structure } = req.body;
    const updateOptions = structure
      ? { ...req.body, uid: await generateCustomId(structure, "users") }
      : req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateOptions,
      {
        new: true,
      }
    );
    res.status(200).json({
      updatedUser,
      msg: "User has been updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
