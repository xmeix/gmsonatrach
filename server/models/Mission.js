import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema(
  {
    objetMission: {
      type: String,
      required: true,
    },
    type: {
      // LOC/ETR
      type: String,
      enum: ["LOCAL", "ETRANGER"],
      required: true,
    },
    budget: {
      type: Number,
      required: true,
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
        idTache: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          enum: ["accomplie", "non-accomplie"],
        },
      },
    ],
    tDateDeb: [
      {
        type: Date,
        required: true,
      },
    ],
    tDateRet: [
      {
        type: Date,
        required: true,
      },
    ],
    moyenTransport: {
      //AVION / ROUTE
      type: String,
      enum: ["avion", "route"],
      required: true,
    },
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
        "planifiée",
        "refusée",
        "annulée",
        "terminée",
        "en-cours",
        "modifiée",
      ],
      default: "en-attente",
    },

    raisonRefus: {
      type: String,
    },
    circonscriptionAdm: {
      //Code wilaya
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Mission = mongoose.model("Mission", MissionSchema);
export default Mission;
