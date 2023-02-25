import Demande from "../Demande.js";
import mongoose from "mongoose";

const DCSchema = new mongoose.Schema(
    {}, {
    discriminatorKey: 'type',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
},
);

const DC = Demande.discriminator('DC', DCSchema);
export default DC;