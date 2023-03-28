import mongoose from "mongoose";
import FMission from "../models/FMission.js";
const toId = mongoose.Types.ObjectId;

export const createOrUpdateFMission = async (mission) => {
  console.log("inside");
  const startMonth = mission.createdAt.getMonth() + 1;
  const startYear = mission.createdAt.getFullYear();

  const existingFMission = await FMission.findOne({
    mission: mission._id,
  });

  if (existingFMission) {
    existingFMission.success_rate = calculateSuccessRate(mission);
    existingFMission.employee_count = mission.employes.length;
    // Update other KPIs as needed
    await existingFMission.save();
  } else {
    const newFMission = new FMission({
      mission: mission._id,
      state: mission.etat,
      month: startMonth,
      year: startYear,
      structure: mission.structure,
      type: mission.type,
      country: mission.pays,
      destination: mission.destination,
      success_rate: calculateSuccessRate(mission),
      employee_count: mission.employes.length,
      accomplishedTask_count: calculateAccomplishedTaskCount(mission),
      nonAccomplishedTask_count: calculateNonAccomplishedTaskCount(mission),
      transport_utilization_rate: calculateTransportUtilizationRate(mission),
    });
    await newFMission.save();
  }

  console.log("outside");
};

const calculateSuccessRate = (mission) => {
  const totalTasks = mission.taches.length;
  const accomplishedTasks = mission.taches.filter(
    (t) => t.state === "accomplie"
  ).length;
  return (accomplishedTasks / totalTasks) * 100;
};

// Calculate the number of accomplished tasks in a mission
const calculateAccomplishedTaskCount = (mission) => {
  return mission.taches.filter((tache) => tache.state === "accomplie").length;
};

// Calculate the number of non-accomplished tasks in a mission
const calculateNonAccomplishedTaskCount = (mission) => {
  return mission.taches.filter((tache) => tache.state === "non-accomplie")
    .length;
};

// Calculate transport utilization rate of a mission
const calculateTransportUtilizationRate = (mission) => {
  const totalTransport =
    mission.moyenTransport.length + mission.moyenTransportRet.length;
  const usedTransport =
    mission.moyenTransport.filter((t) => t === "avion").length +
    mission.moyenTransportRet.filter((t) => t === "avion").length;
  return usedTransport / totalTransport;
};
