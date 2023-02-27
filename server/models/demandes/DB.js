import Demande from "../Demande.js";
import mongoose from "mongoose";

const DBSchema = new mongoose.Schema(
  {
    numSC: {
      type: Number,
      //required: true,
    },
    designationSC: {
      type: String,
      //required: true,
    },
    montantEngage: {
      type: Number,
      //required: true,
    },
    nature: {
      //Aller ret/aller
      type: String,
      enum: ["aller-retour", "retour", "aller"],
      required: true,
    },
    motifDep: {
      //mission travail/mission formation
      type: String,
      enum: ["travail", "formation"],
      required: true,
    },
    observation: {
      type: String,
      required: true,
    },
    dateDepart: {
      type: Date,
      //required: true,
    },
    dateRetour: {
      type: Date,
      //required: true,
    },
  },
  {
    discriminatorKey: "type",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DB = Demande.discriminator("DB", DBSchema);
export default DB;
