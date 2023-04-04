import mongoose from "mongoose";

const FDocumentSchema = new mongoose.Schema(
  {
    // date: { type: Date, required: true },
    structure: { type: String, required: true },
    etat: { type: String, required: true },
    type: { type: String, required: true }, //RFM DM DB DC OM
    nature: { type: String }, //RFM DM DB DC OM
    motifDep: { type: String },
    circulation_count: { type: Number, default: 0 }, // nombre de documents so without precising the othher docs count because it makes no sense
  },
  {
    timestamps: true,
  }
);
const FDocument = mongoose.model("FDocument", FDocumentSchema);
export default FDocument;
