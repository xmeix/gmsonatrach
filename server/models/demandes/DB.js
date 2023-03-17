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
    },
    division: {
      type: String,
    },
    base: {
      type: String,
    },
    gisement: {
      type: String,
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
