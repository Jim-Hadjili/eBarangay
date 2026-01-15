// server.js or app.js (Node/Express)
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Listen for new client connections
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Optional: Listen for events from client
  socket.on("joinQueue", (queueId) => {
    console.log(`User joined queue: ${queueId}`);
    socket.join(queueId); // create a room for each queue
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Example: Emit a notification when it’s user’s turn
function notifyUser(queueId, message) {
  io.to(queueId).emit("yourTurn", message);
}

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
