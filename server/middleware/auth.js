import jwt from 'jsonwebtoken';



export const generateJWT = (user) => {


  const payload = {

    id: user._id,
    role: user.role,
    email: user.email,

  };

  const options = {
    expiresIn: '1d',
  };

  const secret = process.env.ACCESS_TOKEN_SECRET;

  return jwt.sign(payload, secret, options);
};


export const verifyToken = async (req, res, next) => {


  let token = await req.header("Cookie");


  try {
 
    // let authHeader = req.header("Authorization") || req.header("authorization");
    if (!token) return res.status(403).send({error: "Access Denied"});
    if (!token.startsWith("jwt=")) return res.status(401).json({ error: "Unauthorized" });
    token = await token.replace('jwt=', '');
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; 

    next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 1) {
      next();
    } else {
      res.status(403).json({error: "You are not allowed to do that!"});
    }
  });
};


export const verifyTokenAndSec = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 2 || req.user.role === 1) {
      next();
    } else {
      res.status(403).json({error: "You are not allowed to do that!"});
    }
  });
};