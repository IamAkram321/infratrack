const express = require("express");
const router = express.Router();

const {
  getAllIssues,
  createIssue,
} = require("../controllers/issueController");

// GET /api/issues
router.get("/", getAllIssues);

// POST /api/issues
router.post("/", createIssue);

module.exports = router;
