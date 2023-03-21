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
const setUpChangeStream = async () => {
  const pipeline = [
    {
      $match: {
        $and: [
          { "fullDocument.tDateDeb": { $lt: new Date() } },
          { "fullDocument.tDateRet": { $gte: new Date() } },
          { "fullDocument.etat": "acceptée" },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        missionId: "$fullDocument._id",
      },
    },
  ];

  const changeStream = Mission.watch(pipeline);

  changeStream.on("change", async (change) => {
    try {
      const { missionId } = change.fullDocument;
      await Mission.updateOne(
        { _id: missionId },
        { $set: { etat: "en-cours" } }
      );
    } catch (error) {
      console.error(error);
    }
  });
};
// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Set up the HTTP server and Socket.IO instance
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
      },
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

    /**____________________________________________________________________________ */
    //adding triggers logic:
    // Set up a change stream for the Mission collection

    setUpChangeStream();
    // ____________________________________________________________________________

    // Start listening for HTTP requests
    server.listen(process.env.PORT || 6001, () => {
      console.log(`Server listening on port ${process.env.PORT || 6001}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB database: ${error.message}`);
  });
