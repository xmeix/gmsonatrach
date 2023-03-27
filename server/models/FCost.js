import mongoose from "mongoose";

const FCostSchema = new mongoose.Schema(
  {
    cost_id: { type: ObjectId },
    month: { type: Number },
    year: { type: Number },
    initial_budget_moyen: { type: Number },
    consumed_budget_moyen: { type: Number },
    revenue_moyen: { type: Number },
  },
  {
    timestamps: true,
  }
);
const FCost = mongoose.model("FCost", FCostSchema);
export default FCost;
