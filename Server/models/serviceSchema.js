const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    identifier: { type: String, required: true },
    queueLimit: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
