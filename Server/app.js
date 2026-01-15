// app.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/databaseConnection");
require("dotenv").config();

connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Make io accessible to routes
app.set("io", io);

// Add CORS middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/services", require("./routes/services.routes"));
app.use("/api/queue", require("./routes/queue.routes"));

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins their queue room
  socket.on("joinQueueRoom", (queueCode) => {
    socket.join(queueCode);
    console.log(`User ${socket.id} joined queue room: ${queueCode}`);
  });

  // User leaves queue room
  socket.on("leaveQueueRoom", (queueCode) => {
    socket.leave(queueCode);
    console.log(`User ${socket.id} left queue room: ${queueCode}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

module.exports = { app, server, io };
