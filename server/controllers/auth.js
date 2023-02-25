import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJWT } from "../middleware/auth.js";
import User from "../models/User.js";
import cookie from "cookie";

/** REGISTER USER */
export const register = async (req, res) => {
    try {
        const { nom, prenom, fonction, numTel, adresse, dateNaissance, lieuNaissance, email, password, role, etat } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            nom,
            prenom,
            fonction,
            numTel,
            adresse,
            dateNaissance,
            lieuNaissance,
            email,
            password: passwordHash,
            role,
            etat,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ savedUser, msg: "Sign up successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/** LOGIN USER */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);;
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
        const token = generateJWT(user);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, //should be true in production
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        delete user.password;

        res.status(200).json({ token, user, msg: "logged in successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/** REFRESH */
export const refresh = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.status(401).json({ msg: "Unauthorized" });

        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            asyncHandler(async (err, decoded) => {
                if (err) return res.status(403).json({ msg: "forbidden" });

                const user = await User.findOne({ email: decoded.email });
                if (!user) return res.status(400).json({ msg: "Unauthorized" });

                const payload = {

                    id: user._id,
                    role: user.role,
                    email: user.email,

                };
                const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1m' }
                );


                res.status(200).json({ token, user });
            })
        );

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}


/** LOGOUT */
export const logout = async (req, res) => {

    const cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.jwt) {
        return res.status(400).json({ error: 'JWT cookie not found' });
    }
    res.clearCookie('jwt');
    res.json({ msg: 'Logged out successfully' });

}