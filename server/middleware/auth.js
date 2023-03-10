import jwt from "jsonwebtoken";
import { refresh } from "../controllers/auth.js";

export const generateJWT = (user, exp, secret) => {
  const payload = {
    UserInfo: {
      id: user._id,
      role: user.role,
      email: user.email,
      structure: user.structure,
    },
  };

  const options = {
    expiresIn: exp,
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized2" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // If access token is expired, try to refresh it
        return refresh(req, res, next);
      }
      return res
        .status(403)
        .json({ error: "access token error(Invalid or expired)" });
    }
    req.user = decoded.UserInfo;
    next();
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "directeur") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  });
};

export const verifyTokenAndResponsable = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.role === "directeur" ||
      req.user.role === "responsable" ||
      req.user.role === "secretaire"
    ) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  });
};

export const verifyTokenAndSec = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "secretaire" || req.user.role === "directeur") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  });
};
export function checkFields(fields) {
  for (let field of fields) {
    if (field === "") {
      return false;
    }
  }
  return true;
}
