import mongoose from "mongoose";
import FMission from "../models/FMission.js";
const toId = mongoose.Types.ObjectId;

export const createOrUpdateFMission = async (
  newMission,
  operation,
  oldMission,
  updateType
) => {
  //cas creation mission
  console.log(
    "_________________________________________________________________"
  );
  console.log(newMission.taches);
  console.log(
    "_________________________________________________________________"
  );
  switch (operation) {
    case "creation":
      const mostRecent = await FMission.findOne({
        etat: "en-attente",
        structure: newMission.structure,
        type: newMission.type,
        country: newMission.pays,
        departure: newMission.lieuDep,
        destination: newMission.destination,
      }).sort({ createdAt: -1 });

      // Duplicate the most recent document and increment the circulation_count field
      const newFMission = new FMission({
        etat: "en-attente",
        structure: newMission.structure,
        type: newMission.type,
        country: newMission.pays,
        departure: newMission.lieuDep,
        destination: newMission.destination,
        mission_count: mostRecent ? mostRecent.mission_count + 1 : 1,
        success_count: 0,
        fail_count: mostRecent
          ? mostRecent.fail_count + newMission.taches.length
          : newMission.taches.length,
        employee_count: mostRecent
          ? mostRecent.employee_count + newMission.employes.length
          : newMission.employes.length,
        road_utilization_count: mostRecent
          ? mostRecent.road_utilization_count +
            calculateTransportUtilizationCount(newMission, "route")
          : calculateTransportUtilizationCount(newMission, "route"),
        airline_utilization_count: mostRecent
          ? mostRecent.airline_utilization_count +
            calculateTransportUtilizationCount(newMission, "avion")
          : calculateTransportUtilizationCount(newMission, "avion"),
        // createdAt: newMission.createdAt,
      });

      await newFMission.save();
      break;

    case "update":
      // Find the most recent document with same type, structure, and old etat
      const oldFMission = await FMission.findOne({
        etat: oldMission ? oldMission.etat : "en-attente",
        structure: newMission.structure,
        type: newMission.type,
        country: newMission.pays,
        departure: newMission.lieuDep,
        destination: newMission.destination,
      }).sort({ createdAt: -1 });
      // Find the most recent document with same type, structure, and etat
      const recentFMission = await FMission.findOne({
        etat: newMission ? newMission.etat : "",
        structure: newMission.structure,
        type: newMission.type,
        country: newMission.pays,
        departure: newMission.lieuDep,
        destination: newMission.destination,
      }).sort({ createdAt: -1 });

      console.log("Mission___________________________________");
      console.log(oldMission);
      console.log("_________________________________________");
      switch (updateType) {
        case "etat":
          // Duplicate the old document and decrement its circulation_count field
          let oldUpdatedDocument = new FMission({
            etat: oldMission.etat,
            structure: oldMission.structure,
            type: oldMission.type,
            country: oldMission.pays,
            departure: oldMission.lieuDep,
            destination: oldMission.destination,
            mission_count: oldFMission ? oldFMission.mission_count - 1 : 0,
            success_count: oldFMission ? oldFMission.success_count : 0,
            fail_count: oldFMission
              ? oldFMission.fail_count - calculateFailCount(newMission)
              : 0,
            employee_count: oldFMission
              ? oldFMission.employee_count - newMission.employes.length
              : 0,
            road_utilization_count: oldFMission
              ? oldFMission.road_utilization_count -
                calculateTransportUtilizationCount(newMission, "route")
              : 0,
            airline_utilization_count: oldFMission
              ? oldFMission.airline_utilization_count -
                calculateTransportUtilizationCount(newMission, "avion")
              : 0,
          });
          await oldUpdatedDocument.save();

          let newUpdatedDocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission
              ? recentFMission.mission_count + 1
              : 1,
            success_count: recentFMission ? recentFMission.success_count : 0,
            fail_count: recentFMission
              ? recentFMission.fail_count + calculateFailCount(newMission)
              : calculateFailCount(newMission),
            employee_count: recentFMission
              ? recentFMission.employee_count + newMission.employes.length
              : newMission.employes.length,
            road_utilization_count: recentFMission
              ? recentFMission.road_utilization_count +
                calculateTransportUtilizationCount(newMission, "route")
              : calculateTransportUtilizationCount(newMission, "route"),
            airline_utilization_count: recentFMission
              ? recentFMission.airline_utilization_count +
                calculateTransportUtilizationCount(newMission, "avion")
              : calculateTransportUtilizationCount(newMission, "avion"),
          });
          await newUpdatedDocument.save();

          break;
        case "tache":
          // Duplicate the old document and decrement its circulation_count field
          const diff = calculateDifferenceAT(oldFMission, newMission);
          newUpdatedDocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission.mission_count,
            success_count:
              diff > 0
                ? recentFMission.success_count - diff
                : recentFMission.success_count + diff,
            fail_count:
              diff < 0
                ? recentFMission.fail_count - diff
                : recentFMission.fail_count + diff,
            employee_count: recentFMission.employee_count,
            road_utilization_count: recentFMission.road_utilization_count,
            airline_utilization_count: recentFMission.airline_utilization_count,
          });
          await newUpdatedDocument.save();
          break;

        default:
          break;
      }

    default:
      break;
  }
};

// Calculate the number of accomplished tasks in a mission
const calculateDifferenceAT = (oldMission, NewMission) => {
  return (
    oldMission.taches.filter((tache) => tache.state === "accomplie").length -
    NewMission.taches.filter((tache) => tache.state === "accomplie").length
  );
};

const calculateFailCount = (NewMission) => {
  return NewMission.taches.filter((tache) => tache.state === "non-accomplie")
    .length;
};
const calculateTransportUtilizationCount = (mission, type) => {
  // const totalTransport =
  //   mission.moyenTransport.length + mission.moyenTransportRet.length;
  const usedTransport =
    mission.moyenTransport.filter((t) => t === type).length +
    mission.moyenTransportRet.filter((t) => t === type).length;
  return usedTransport;
};
export const getMissionKPIS = async (req, res) => {
  try {
    const missionKpis = await FMission.find();
    res.status(200).json(missionKpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const calculateSuccessRate = (mission) => {
//   const totalTasks = mission.taches.length;
//   const accomplishedTasks = mission.taches.filter(
//     (t) => t.state === "accomplie"
//   ).length;
//   return (accomplishedTasks / totalTasks) * 100;
// };

// // Calculate transport utilization rate of a mission
