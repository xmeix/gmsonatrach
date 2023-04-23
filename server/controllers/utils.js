import { connectedUsers, io } from "../index.js";

export const emitData = async (link, data) => {
  // Emit the notification event to each socket ID associated with the user ID
  console.log("____________________________________________________");
  console.log(connectedUsers);
  console.log("____________________________________________________");
  connectedUsers.forEach((item) => {
    const { userId, socketId } = item;
    io.to(socketId).emit(link, data);
  });
};
