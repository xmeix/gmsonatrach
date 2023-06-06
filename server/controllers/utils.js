import { connectedUsers, io } from "../index.js";
import CustomId from "../models/CustomId.js";

export const emitGetData = (users, link) => {
  connectedUsers.forEach((user) => {
    if (users.includes(user.userId.toString())) {
      io.to(user.socketId).emit(link, user.tabId);
    }
  });
};

// export const emitGetData = (users, link) => {
//   const userSockets = connectedUsers
//     .filter((user) => users.includes(user.userId.toString()))
//     .map((user) => user.socketId);
//   const userTabs = connectedUsers
//     .filter((user) => users.includes(user.userId.toString()))
//     .map((user) => user.tabId);

//   io.to(userSockets).emit(link, userTabs);
// };

// export const emitData = async (link, data) => {
//   connectedUsers.forEach((item) => {
//     const { userId, socketId } = item;
//     io.to(socketId).emit(link, data);
//   });
// };
export const emitDataTo = async (link, data) => {
  // Emit the notification event to each socket ID associated with the user ID
  // console.log("____________________________________________________");
  // console.log(connectedUsers);
  // console.log("____________________________________________________");
  connectedUsers.forEach((item) => {
    const { userId, socketId } = item;
    io.to(socketId).emit(link, data);
  });
};

export const generateCustomId = async (structure, collectionName) => {
  // Retrieve the counter document for the given structure and collection
  const query = { structure: structure, collectionName: collectionName };
  const update = { $inc: { count: 1 } };
  const options = { returnOriginal: false, upsert: true };
  const result = await CustomId.findOneAndUpdate(query, update, options);

  let count = result ? result.count : 0;

  // Increment the count by 1
  count++;
  // Generate the custom ID
  const prefix = getPrefixFromStructure(structure);
  const prefixCollect = getPrefixFromCollection(collectionName);
  const cus = prefix + prefixCollect + count.toString().padStart(5, "0");

  return cus;
};

function getPrefixFromStructure(structure) {
  const prefixMap = {
    SECRETARIAT: "01",
    DG: "02",
    RELEX: "03",
    PMO: "04",
    FIN: "05",
    SD: "06",
    PRC: "07",
    HCM: "08",
    MRO: "09",
    IPM: "10",
    PDN: "11",
    TECH: "12",
    DATA: "13",
    CHANGE: "14",
  };

  return prefixMap[structure] || "";
}
function getPrefixFromCollection(collectionName) {
  const prefixMap = {
    users: "1",
    missions: "2",
    demandes: "3",
    ordremissions: "4",
    rapportfms: "5",
  };

  return prefixMap[collectionName] || "";
}
