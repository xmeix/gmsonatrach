import mongoose from "mongoose";

const DemandeSchema = new mongoose.Schema(
  {
    motif: {
      type: String,
      default: "",
    },
    etat: {
      type: String,
      enum: ["en-attente", "acceptée", "refusée", "annulée"],
      default: "en-attente",
    },
    raisonRefus: {
      type: String,
      default: "",
    },
    idEmetteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    idDestinataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  }, 
  {
    timestamps: true,
  },
  {
    discriminatorKey: "type",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Demande = mongoose.model("Demande", DemandeSchema);
export default Demande;
