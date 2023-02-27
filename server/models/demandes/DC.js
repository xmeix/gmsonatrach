import Demande from "../Demande.js";
import mongoose from "mongoose";

const DCSchema = new mongoose.Schema(
  {
    NbJours: {
      type: Number,
      required: true,
    },
    DateDepart: {
      type: Date,
      required: true,
    },
    DateRetour: {
      type: Date,
      required: true,
    },
    LieuSejour: {
      type: String,
      //required: true,
    },
    Nature: {
      type: String,
      enum: [
        "reliquat",
        "annuel",
        "sans-solde",
        "exceptionnel",
        "recupération",
      ],
      required: true,
    },
  },
  {
    discriminatorKey: "type",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DC = Demande.discriminator("DC", DCSchema);
export default DC;
