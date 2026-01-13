require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const issueRoutes = require("./routes/issueRoutes");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "InfraTrack backend running" });
});


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
