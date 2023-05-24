import Demande from "../Demande.js";
import mongoose from "mongoose";

const DMSchema = new mongoose.Schema(
    {}, {
    discriminatorKey: 'type',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
},
);

const DM = Demande.discriminator('DM', DMSchema);
export default DM;