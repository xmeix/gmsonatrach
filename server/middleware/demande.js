import mongoose from "mongoose";
import Demande from "../models/Demande.js";
import User from "../models/User.js";

const toId = mongoose.Types.ObjectId;
//DB ==> DIR|SEC, DC,DM ==> Emp
export const checkCreateAccess = async (req, res, next) => {
  try {
    const type = req.params.type;
    const role = req.user.role;

    switch (role) {
      case 1:
        {
          /** allowed to create DB only */
          if (type !== "DB") {
            throw new Error("Unauthorized");
          }
        }
        break;
      case 2:
        {
          /** allowed to create Db Only */
          if (type !== "DB") {
            throw new Error("Unauthorized");
          }
        }
        break;
      case 3:
        {
          /** allowed to create DM,DC*/
          if (type === "DB") {
            throw new Error("Unauthorized");
          }
        }
        break;
      case 4:
        {
          /** NOT ALLOWED TO CREATE ANYTHING*/
          throw new Error("Unauthorized");
        }
        break;
    }
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const updateAccessCheck = async (req, res, next) => {
  try {
    const demande = await Demande.findById(req.params.id);
    const type = demande.__t;
    const user = await User.findById(req.user.id);
    const operation = req.body.etat;

    switch (type) {
      case "DB":
        {
          //DB can be updated by
          /**
           * directeur (cancel)
           * secretaire (cancel)
           * Relex (accept , refuse)
           * NOT EMPLOYE
           */
          if (
            user.role === 3 ||
            (user.role === 4 && operation === 4) ||
            (user.role !== 4 && (operation === 2 || operation === 3))
          )
            throw new Error("Unauthorized");
        }
        break;
      case "DC":
        {
          //DC can be updated by
          /**
           * employe ( cancel )
           * directeur ( accept / refuse )
           * NOT SECRETAIRE NOT RELEX
           */
          if (
            user.role === 2 ||
            user.role === 4 ||
            (operation === 4 && user.role !== 3) ||
            ((operation === 2 || operation === 3) && user.role !== 1)
          )
            throw new Error("Unauthorized");
        }
        break;
      case "DM":
        {
          //DM can be updated by
          /**
           * employe ( cancel )
           * directeur ( accept / refuse )
           * secretaire ( accept / refuse )
           * NOT RELEX
           */
          if (
            user.role === 4 ||
            (user.role !== 3 && operation === 4) ||
            ((operation === 2 || operation === 3) &&
              user.role !== 1 &&
              user.role !== 2)
          )
            throw new Error("Unauthorized");
        }
        break;
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
