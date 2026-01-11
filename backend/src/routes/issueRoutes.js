const express = require("express");
const router = express.Router();

const {
  getAllIssues,
  createIssue,
  updateIssueStatus,
} = require("../controllers/issueController");

router.get("/", getAllIssues);
router.post("/", createIssue);
router.patch("/:id/status", updateIssueStatus);

module.exports = router;
