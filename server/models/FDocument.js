import mongoose from "mongoose";

const FDocumentSchema = new mongoose.Schema(
  {
    date: { type: Date },
    structure: { type: String },
    etat: { type: String },
    type: { type: String }, //RFM DM DB DC OM
    circulation_count: { type: Number }, // nombre de documents so without precising the othher docs count because it makes no sense
   },
  {
    timestamps: true,
  }
);
const FDocument = mongoose.model("FDocument", FDocumentSchema);
export default FDocument;
