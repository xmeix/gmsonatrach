import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import moment from "moment";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import demandeRoutes from "./routes/demande.js";
import missionRoutes from "./routes/mission.js";
import ordreMissionRoutes from "./routes/ordreMission.js";
import depenseRoutes from "./routes/depense.js";
import rapportRoutes from "./routes/rapportFM.js";
import kpisRoutes from "./routes/kpis.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import Mission from "./models/Mission.js";
import User from "./models/User.js";
import RapportFM from "./models/RapportFM.js";
import cron from "node-cron";
import { dbs, dcs, dms, missions } from "../client/src/data/data.js";
import { createOrUpdateFMission } from "./controllers/Kpis.js";
import OrdreMission from "./models/OrdreMission.js";
import DM from "./models/demandes/DM.js";
import DB from "./models/demandes/DB.js";
import DC from "./models/demandes/DC.js";
const toId = mongoose.Types.ObjectId;
// Configure environment variables
dotenv.config();

// Create an instance of express
const app = express();

// Set up middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

// ____________________________________________________________________________
// Enable CORS for API calls
const corsOptions = {
  credentials: true,
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  methods: ["PATCH", "GET", "POST", "DELETE"],
};
app.use(cors(corsOptions));

// ____________________________________________________________________________
// Set up API routes
app.use("/auth", authRoutes);
app.use("/demande", demandeRoutes);
app.use("/mission", missionRoutes);
app.use("/ordremission", ordreMissionRoutes);
app.use("/depense", depenseRoutes);
app.use("/rapportFM", rapportRoutes);
app.use("/kpis", kpisRoutes);
// Set up the HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  },
});

// ____________________________________________________________________________
// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Start listening for HTTP requests
    server.listen(process.env.PORT || 6001, () => {
      console.log(`Server listening on port ${process.env.PORT || 6001}`);
    });
    //ADD DATA ONE TIME ONLY
    //await mongoose.connection.db.dropDatabase(); //ATTENTION DELETES THE WHOOOLE DB

    // Mission.insertMany(missions);
    // DM.insertMany(dms);
     //DB.insertMany(dbs);
    // DC.insertMany(dcs);
    //console.log("end");
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB database: ${error.message}`);
  });
// Set up Socket.IO event listeners
io.on("connection", (socket) => {
  // console.log(`Socket ${socket.id} connected`);

  socket.on("updatedData", async (type) => {
    try {
      console.log(type);
      io.emit("updatedData", type);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("disconnect", () => {
    // console.log(`Socket ${socket.id} disconnected`);
  });
});

/** RUNS EVERY MIDNIGHT */
cron.schedule("31 14 * * *", async () => {
  console.log("working in index.js");

  // Update missions with tDateDeb equal to current time

  const currentDate = moment().format("YYYY-MM-DD");
  const missionsEnCours = await Mission.find(
    {
      tDateDeb: { $eq: currentDate },
      etat: "acceptée",
    },
    { employes: 1 }
  );

  for (const mission of missionsEnCours) {
    mission.etat = "en-cours";
    const employeIds = mission.employes.map((employe) => employe._id);
    await User.updateMany(
      { _id: { $in: employeIds } },
      { $set: { etat: "missionnaire" } }
    );
    await mission.save();

    for (const employeId of employeIds) {
      const rfm = new RapportFM({
        idMission: toId(mission._id),
        idEmploye: toId(employeId),
      });

      const savedRFM = await rfm.save();
    }
  }

  //pour chaque mission je fais ca

  // Update missions with tDateDeb equal to current time and etat equal to en-attente
  console.log("here4");
  await Mission.updateMany(
    { tDateDeb: { $lte: new Date() }, etat: "en-attente" },
    { $set: { etat: "refusée" } }
  );
  console.log("here6");

  // Update missions with tDateRet equal to current time and etat equal to en-cours
  await Mission.updateMany(
    { tDateRet: { $lt: currentDate }, etat: "en-cours" },
    { $set: { etat: "terminée" } }
  );
  console.log("here7");

  // Update users associated with completed missions
  const missionsEnded = await Mission.find({
    etat: "terminée",
  });
  console.log("here8");
  for (const mission of missionsEnded) {
    const employeIds = mission.employes.map((employe) => employe._id);
    await User.updateMany(
      { _id: { $in: employeIds } },
      { $set: { etat: "non-missionnaire" } }
    );
  }

  console.log("finished updating index js ");
  io.emit("cronDataChange");
});

//cron creation RFM+OM
// cron.schedule("13 15 * * *", async () => {
//   //creation auto des RFM + OM
//   console.log("starting");
//   //RFM
//   const missionsEnCours = await Mission.find({
//     etat: { $in: ["en-cours", "terminée"] },
//   });

//   for (const mission of missionsEnCours) {
//     const employeIds = mission.employes.map((employe) => employe._id);

//     for (const employeId of employeIds) {
//       const rfm = new RapportFM({
//         idMission: toId(mission._id),
//         idEmploye: toId(employeId),
//       });

//       const savedRFM = await rfm.save();
//     }
//   }
//   console.log("finished rfm");

//   //OM

//   const missionsAccepted = await Mission.find({
//     etat: { $in: ["acceptée", "en-cours", "terminée"] },
//   });

//   for (const mission of missionsAccepted) {
//     const employeIds = mission.employes.map((employe) => employe._id);

//     for (const employeId of employeIds) {
//       const om = new OrdreMission({
//         mission: toId(mission._id),
//         employe: toId(employeId),
//       });

//       const savedOm = await om.save();
//     }
//   }
//   console.log("finished om");
//   console.log("emmiting");
//   io.emit("cronDataChange");
//   console.log("finished emmiting");
// });

// cron.schedule("15 15 * * *", async () => {
//   const missions = await Mission.find();

//   console.log("here");
//   for (const mission of missions) {
//     createOrUpdateFMission(mission);
//   }
//   console.log("here");
// });
