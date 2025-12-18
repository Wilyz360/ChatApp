const { Server } = require("socket.io");

let io; // Declare io in a broader scope
const onlineUsers = new Map(); // Map to track online users

const initSocket = (server) => {
  // Initialize Socket.io
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Handle user online status
    socket.on("online", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User online:", userId);

      // Notify other users about the online status change
      // Sends to ALL clients EXCEPT the sender
      socket.broadcast.emit("user-status-change", { userId, status: "online" });
    });

    // Handle request for online users
    // Send list of all online users to requesting client
    socket.on("get-online-users", () => {
      const onlineUserIds = Array.from(onlineUsers.keys()); // Get list of online user IDs

      // Sends to ONE specific client (the socket that's making the request)
      socket.emit("online-users", onlineUserIds);
    });

    socket.on("message", (payload) => {
      console.log("Message received:", payload);
      // Broadcast the message to all connected clients
      io.emit("message", payload);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);

      // Find and remove the disconnected user from onlineUsers
      let disconnectedUserId = null;
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        console.log("User offline:", disconnectedUserId);
        // Notify other users about the offline status change
        io.emit("user-status-change", {
          userId: disconnectedUserId,
          status: "offline",
        });
      }
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIo };
