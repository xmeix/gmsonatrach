import mongoose from "mongoose";

const FEmployeeSchema = new mongoose.Schema(
  {
    month: { type: Number },
    year: { type: Number },
    structure: { type: String },
    type: { type: String },
    country: { type: String },
    average_missionnaire_count: { type: Number },
    satisfaction_rate: { type: Number },
    satisfaction_rate_positif: { type: String },
    satisfaction_rate_negatif: { type: String },
    satisfaction_rate_neutre: { type: String },
  },
  {
    timestamps: true,
  }
);
const FEmployee = mongoose.model("FEmployee", FEmployeeSchema);
export default FEmployee;
