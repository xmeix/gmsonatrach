import mongoose from "mongoose";

const FDocumentSchema = new mongoose.Schema(
  {
    month: { type: Number },
    year: { type: Number },
    structure: { type: String },
    etat: { type: String },
    circulation_count: { type: Number },
    rfm_count: { type: Number },
    ticket_demand_count: { type: Number },
    leave_demand_count: { type: Number },
    modification_demand_count: { type: Number },
  },
  {
    timestamps: true,
  }
);
const FDocument = mongoose.model("FDocument", FDocumentSchema);
export default FDocument;
