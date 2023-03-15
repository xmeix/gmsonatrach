import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema(
  {
    objetMission: {
      type: String,
      required: true,
    },
    structure: {
      type: String,
      enum: [
        "PMO",
        "FIN",
        "SD",
        "PRC",
        "HCM",
        "MRO",
        "IPM",
        "PDN",
        "TECH",
        "DATA",
        "CHANGE",
      ],
      required: true,
    },
    type: {
      // LOC/ETR
      type: String,
      enum: ["local", "etranger"],
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    budgetConsome: {
      // a ajouter dans la liste des missions terminées
      type: Number,
      default: 0,
    },
    pays: {
      type: String,
      required: true,
    },
    employes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    taches: [
      {
        content: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          enum: ["accomplie", "non-accomplie"],
          default: "non-accomplie",
        },
      },
    ],
    tDateDeb: {
      type: Date,
      required: true,
    },
    tDateRet: {
      type: Date,
      required: true,
    },
    moyenTransport: {
      //AVION / ROUTE
      type: String,
      enum: ["avion", "route"],
      required: true,
    },
    moyenTransportRet: {
      //AVION / ROUTE
      type: String,
      enum: ["avion", "route"],
      required: true,
    },
    //moyen de transport aller + retour
    lieuDep: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    observation: {
      //text area //
      type: String,
      required: true,
    },
    etat: {
      type: String,
      enum: [
        "en-attente",
        "acceptée", //planifié
        "refusée",
        "en-cours", //Date de debut === current date
        "annulée",
        "terminée", //automatiquement a l envoi du RFM
      ],
      default: "en-attente",
    },
    raisonRefus: {
      type: String,
      default: "",
    },
    circonscriptionAdm: {
      //a supprimer
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Mission = mongoose.model("Mission", MissionSchema);
export default Mission;
