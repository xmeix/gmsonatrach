import jwt from "jsonwebtoken";

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

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
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
