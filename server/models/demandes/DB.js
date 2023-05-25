import Demande from "../Demande.js";
import mongoose from "mongoose";

const DBSchema = new mongoose.Schema(
  {
    numSC: {
      type: Number,
      // default: "",
      //required: true,
    },
    designationSC: {
      type: String,
      default: "",
      //required: true,
    },
    montantEngage: {
      type: Number,
      default: 0,
      //required: true,
    },
    nature: {
      //Aller ret/aller
      type: String,
      enum: ["aller-retour", "retour", "aller"],
      required: true, 
    },
    depart: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    paysDestination: {
      type: String,
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
      default: "",
    },
    dateDepart: {
      type: Date,
      required: true,
    },
    dateRetour: {
      type: Date,
      required: true,
    },
    direction: {
      type: String,
      default: "Projet SH-ONE",
    },
    sousSection: {
      type: String,
      default: "",
    },
    division: {
      type: String,
      default: "",
    },
    base: {
      type: String,
      default: "",
    },
    gisement: {
      type: String,
      default: "",
    },
    employes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    discriminatorKey: "type",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DB = Demande.discriminator("DB", DBSchema);
export default DB;
