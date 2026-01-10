const express = require("express");
const cors = require("cors");
require("dotenv").config();

const issueRoutes = require("./routes/issueRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "InfraTrack backend running" });
});

// api routes
app.use("/api/issues", issueRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
