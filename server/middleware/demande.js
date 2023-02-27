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
      case "directeur":
        {
          /** allowed to create DB only */
          if (type !== "DB") {
            throw new Error("Unauthorized");
          }
        }
        break;
      case "responsable":
        {
          /** allowed to create Db Only */
          if (type !== "DB") {
            throw new Error("Unauthorized");
          }
        }
        break;
      case "secretaire":
        {
          /** allowed to create Db Only */
          if (type !== "DB") {
            throw new Error("Unauthorized");
          }
        }
        break;
      case "relex":
        {
          /** NOT ALLOWED TO CREATE ANYTHING*/
          throw new Error("Unauthorized");
        }
        break;
      case "employe":
        {
          /** allowed to create DM,DC*/
          if (type === "DB") {
            throw new Error("Unauthorized");
          }
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
           * responsable (cancel his own)
           * secretaire (cancel)
           * Relex (accept , refuse)
           * NOT EMPLOYE
           */
          if (
            user.role === "employe" ||
            (user.role === "relex" && operation === "annulée") ||
            (user.role !== "relex" &&
              (operation === "acceptée" || operation === "refusée")) ||
            (user.role === "responsable" &&
              operation === "annulée" &&
              demande.idEmetteur.toString() !== user.id)
          )
            throw new Error("Unauthorized");
        }
        break;
      case "DC":
        {
          //DC can be updated by
          /**
           * employe ( cancel his own)
           * responsable (accept / refuse his own structure emp demands )
           * directeur ( accept / refuse )
           * NOT SECRETAIRE NOT RELEX
           */
          if (
            user.role === "secretaire" ||
            user.role === "relex" ||
            (operation === "annulée" && user.role !== "employe") ||
            ((operation === "acceptée" || operation === "refusée") &&
              user.role !== "directeur" &&
              user.role !== "responsable") ||
            (user.role === "employe" &&
              operation === "annulée" &&
              demande.idEmetteur.toString() !== user.id) ||
            (user.role === "responsable" &&
              (operation === "acceptée" || operation === "refusée") &&
              demande.idDestinataire.toString() !== user.id)
          )
            throw new Error("Unauthorized");
        }
        break;
      case "DM":
        {
          //DM can be updated by
          /**
           * employe ( cancel his own)
           * responsable (accept / refuse his own sectors demands)
           * directeur ( accept / refuse )
           * secretaire ( accept / refuse )
           * NOT RELEX
           */
          if (
            user.role === "relex" ||
            (user.role !== "employe" && operation === "annulée") ||
            ((operation === "acceptée" || operation === "refusée") &&
              user.role !== "directeur" &&
              user.role !== "secretaire" &&
              user.role !== "responsable") ||
            (user.role === "employe" &&
              operation === "annulée" &&
              demande.idEmetteur.toString() !== user.id) ||
            (user.role === "responsable" &&
              (operation === "acceptée" || operation === "refusée") &&
              demande.idDestinataire.toString() !== user.id)
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
