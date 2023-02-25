import mongoose from "mongoose";

const RapportFMSchema = new mongoose.Schema(
           {
             deroulement: [
                {
                    IdDate: {
                        type: Date,
                        required: true,
                    },
                    hebergement:{
                        type: Number,//0 ou 1
                        required: true,
                    },
                    dejeuner:{
                        type: Number,//0 ou 1
                        required: true,
                    },
                    diner:{
                        type: Number,//0 ou 1
                        required: true,
                    },
                    observation:{
                        type: String,
                    },
                }
             ],
             idMission:{
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Mission',
              required : true,
            },
            idEmploye:{
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required : true,
            },
           },{
            timestamps: true
           }
);

const RapportFM = mongoose.model("RapportFM",RapportFMSchema);
export default RapportFM;