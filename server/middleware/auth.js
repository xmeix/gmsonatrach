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

// export const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (!authHeader) {
//     return res.status(401).json({ error: "Authorization header missing" });
//   }

//   if (!authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ error: "Authorization header must start with 'Bearer '" });
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Access token not provided" });
//   }

//   // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//   //   if (err) {
//   //     if (err.name === "TokenExpiredError") {
//   //       // If access token is expired, try to refresh it
//   //       return refresh(req, res, next);
//   //     }
//   //     return res
//   //       .status(403)
//   //       .json({ error: "access token error(Invalid or expired)" });
//   //   }
//   //   req.user = decoded.UserInfo;
//   //   next();
//   // });

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = decoded.UserInfo;
//     next();
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(403).json({ error: "Access token has expired" });
//     }
//     return res.status(403).json({ error: "Invalid access token" });
//   }
// };

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("req.headers:", req.headers); // add this line

  console.log("authHeader" + authHeader);
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header must start with 'Bearer '" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.UserInfo;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      try {
        const newToken = await refresh(req, res);
        res.setHeader("Authorization", `Bearer ${newToken}`);
         res.setHeader("Old-Authorization", `Bearer ${token}`);
        req.user = jwt.decode(newToken).UserInfo;
        next();
      } catch (e) {
        return res
          .status(403)
          .json({ error: "Failed to refresh access token" });
      }
    } else {
      return res.status(403).json({ error: "Invalid access token" });
    }
  }
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
      res.status(403).json({ error: "Unauthorized8" });
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
