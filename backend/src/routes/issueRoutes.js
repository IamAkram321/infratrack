const express = require("express");
const router = express.Router();

const {
  getAllIssues,
  createIssue,
  updateIssueStatus,
} = require("../controllers/issueController");

const {
  protect,
  requireAdmin,
} = require("../middlewares/authMiddleware");

// Public
router.get("/", getAllIssues);

// Authenticated users
router.post("/", protect, createIssue);

// Admin-only
router.patch("/:id/status", protect, requireAdmin, updateIssueStatus);

module.exports = router;
