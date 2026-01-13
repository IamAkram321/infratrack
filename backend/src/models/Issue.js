const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["pothole", "streetlight", "electric_pole", "manhole"],
    },
    location: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["reported", "in_progress", "fixed"],
      default: "reported",
    },
  },
  { timestamps: true }
);

issueSchema.index({ status: 1, severity: 1 });
issueSchema.index({ priorityScore: -1, createdAt: 1 });


module.exports = mongoose.model("Issue", issueSchema);
