import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import demandeRoutes from "./routes/demande.js";
import missionRoutes from "./routes/mission.js";
import ordreMissionRoutes from "./routes/ordreMission.js";
import depenseRoutes from "./routes/depense.js";
import rapportRoutes from "./routes/rapportFM.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import Mission from "./models/Mission.js";
import User from "./models/User.js";
import RapportFM from "./models/RapportFM.js";
import cron from "node-cron";
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
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB database: ${error.message}`);
  });
// Set up Socket.IO event listeners
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("updatedData", async (data, type) => {
    io.emit("updatedData", data, type);
  });
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

/** RUNS EVERY MIDNIGHT */
cron.schedule("58 10 * * *", async () => {
  console.log("working in index.js");

  // Update missions from accepted to en cours
  await Mission.updateMany(
    {
      tDateDeb: { $lte: new Date() },
      tDateRet: { $gte: new Date() },
      etat: "acceptée",
    },
    { $set: { etat: "en-cours" } }
  );
  console.log("here1");
  // Update missions with tDateDeb equal to current time
  await Mission.updateMany(
    { tDateDeb: new Date(), etat: "acceptée" },
    { $set: { etat: "en-cours" } }
  );
  console.log("here2");

  // Update users associated with missions en cours
  const missionsEnCours = await Mission.find({
    etat: "en-cours",
  });
  console.log("here3");

  for (const mission of missionsEnCours) {
    const employeIds = mission.employes.map((employe) => employe._id);
    await User.updateMany(
      { _id: { $in: employeIds } },
      { $set: { etat: "missionnaire" } }
    );
  }
  // Create RFM documents for new missions
  // const missions = await Mission.find({
  //   etat: { $in: ["en-cours", "acceptée"] },
  //   tDateDeb: new Date(),
  // });

  //pour chaque mission je fais ca
  console.log("here4");

  for (const mission of missionsEnCours) {
    const employeIds = mission.employes.map((employe) => employe._id);
    console.log("mission id : " + mission._id);

    for (const employeId of employeIds) {
      console.log("emp id : " + employeId);
      const rfm = new RapportFM({
        idMission: toId(mission._id),
        idEmploye: toId(employeId),
      });

      const savedRFM = await rfm.save();
      console.log(savedRFM);
    }
  }
  // Update missions with tDateDeb equal to current time and etat equal to en-attente
  console.log("here5");
  await Mission.updateMany(
    { tDateDeb: { $lte: new Date() }, etat: "en-attente" },
    { $set: { etat: "refusée" } }
  );
  console.log("here6");

  // Update missions with tDateRet equal to current time and etat equal to en-cours
  await Mission.updateMany(
    { tDateRet: { $lt: new Date() }, etat: "en-cours" },
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
