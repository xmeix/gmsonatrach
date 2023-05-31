import { connectedUsers, io } from "../index.js";
import CustomId from "../models/CustomId.js";

export const emitData = async (link, data) => {
  // Emit the notification event to each socket ID associated with the user ID
  // console.log("____________________________________________________");
  // console.log(connectedUsers);
  // console.log("____________________________________________________");
  connectedUsers.forEach((item) => {
    const { userId, socketId } = item;
    io.to(socketId).emit(link, data);
  });
};

export const emitDataSpec = async (link, data, sid) => {
  connectedUsers.forEach((item) => {
    const { userId, socketIds } = item;
    if (data.toString() === userId.toString() && Array.isArray(socketIds)) {
      socketIds.forEach((socketId) => {
        if (sid.includes(socketId)) {
          io.to(socketId).emit(link);
        }
      });
    }
  });
  console.log(connectedUsers);
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
  const cus = prefix + count.toString().padStart(5, "0");

  return cus;
};

function getPrefixFromStructure(structure) {
  return structure.toString();
}
