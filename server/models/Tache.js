import mongoose from "mongoose";

const TacheSchema = new mongoose.Schema(
           {
              etat: {
                type: Number,
                default : 1,// non accomplie
              },
              nom: {
                type: String,
                required: true,
              },
              description: {
                type: String,
                required: true,
              },
              
           },{
            timestamps: true
           }
);

const Tache = mongoose.model("Tache",TacheSchema);
export default Tache;