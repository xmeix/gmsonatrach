import mongoose from "mongoose";

const DemandeSchema = new mongoose.Schema(
  {
    motif: {
      type: String,
      required: true,
    },
    etat: {
      type: Number,
      default: 1
    },
    idEmetteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    idDestinataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }, {
  timestamps: true
}, {
  discriminatorKey: 'type',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
},
);

const Demande = mongoose.model("Demande", DemandeSchema);
export default Demande;