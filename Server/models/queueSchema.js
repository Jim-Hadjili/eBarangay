const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceIdentifier: { type: String, required: true },
    queueNumber: { type: Number, required: true },
    queueCode: { type: String, required: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Queue", queueSchema);
