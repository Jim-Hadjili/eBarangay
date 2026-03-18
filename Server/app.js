// app.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/databaseConnection");
const path = require("path");
require("dotenv").config();

connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup with production-ready configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"], // Polling first for Render compatibility
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e6,
  connectTimeout: 45000,
});

// Make io accessible to routes
app.set("io", io);

// Add CORS middleware
const allowedOrigins = [
  "https://ebarangay-healthcare.vercel.app", // production frontend (hardcoded fallback)
  "http://localhost:5173",
  "http://localhost:5000",
];

// Also add CLIENT_URL from env if it's different
if (process.env.CLIENT_URL) {
  const envOrigin = process.env.CLIENT_URL.replace(/\/$/, "");
  if (!allowedOrigins.includes(envOrigin)) allowedOrigins.push(envOrigin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tool requests with no origin header
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }
      // Return false (not an Error) so Express does NOT trigger the 500 error handler
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/services", require("./routes/services.routes"));
app.use("/api/queue", require("./routes/queue.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/activity", require("./routes/activity.routes"));
app.use("/api/monitoring", require("./routes/monitoring.routes"));
app.use("/api/medical-records", require("./routes/medicalRecord.routes")); // Add this line
app.use("/api/waiting-time", require("./routes/waitingTime.routes")); // Add waiting time routes
app.use("/api/reports", require("./routes/reports.routes")); // Add reports routes

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

  // User joins queue history room for real-time updates
  socket.on("joinQueueHistory", () => {
    const userId = socket.handshake.auth?.userId || socket.id;
    const roomName = `queueHistory_${userId}`;
    socket.join(roomName);
    console.log(`User ${socket.id} joined queue history room: ${roomName}`);
  });

  // User leaves queue history room
  socket.on("leaveQueueHistory", () => {
    const userId = socket.handshake.auth?.userId || socket.id;
    const roomName = `queueHistory_${userId}`;
    socket.leave(roomName);
    console.log(`User ${socket.id} left queue history room: ${roomName}`);
  });

  // Admin joins dashboard room for real-time updates
  socket.on("joinDashboard", () => {
    socket.join("dashboard");
    console.log(`User ${socket.id} joined dashboard room`);
  });

  // Admin leaves dashboard room
  socket.on("leaveDashboard", () => {
    socket.leave("dashboard");
    console.log(`User ${socket.id} left dashboard room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

module.exports = { app, server, io };
