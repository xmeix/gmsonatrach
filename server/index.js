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
import { getAllMissions } from "./controllers/mission.js";
import { getDemandes } from "./controllers/demande.js";
import Demande from "./models/Demande.js";

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
app.use(bodyParser.json());
app.use(cookieParser());

// Enable CORS for API calls
const corsOptions = {
  credentials: true,
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
};
app.use(cors(corsOptions));

// Set up API routes
app.use("/auth", authRoutes);
app.use("/demande", demandeRoutes);
app.use("/mission", missionRoutes);
app.use("/ordremission", ordreMissionRoutes);
app.use("/depense", depenseRoutes);
app.use("/rapportFM", rapportRoutes);

// Connect to the MongoDB database
const PORT = process.env.PORT || 6001;
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  },
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server Port ${PORT}`)); // Log message when user connects via socket
    io.on("connection", (socket) => {
      console.log("user is connected: " + socket.id);
      socket.on("updatedData", async (demandes) => {
        console.log("updated" + demandes);
        io.emit("updatedData", demandes);
      });
    });
  })
  .catch((error) => console.log(`${error}: did not connect.`));
