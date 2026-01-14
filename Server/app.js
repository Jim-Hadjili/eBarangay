// app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/databaseConnection");
require("dotenv").config();

connectDB();

const app = express();

// Add CORS middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;
