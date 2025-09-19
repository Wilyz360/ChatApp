const { Server } = require("socket.io");

let io; // Declare io in a broader scope

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

    socket.on("message", (payload) => {
      console.log("Message received:", payload);
      // Broadcast the message to all connected clients
      io.emit("message", payload);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
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
