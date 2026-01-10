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
    status: {
      type: String,
      enum: ["reported", "in_progress", "fixed"],
      default: "reported",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
