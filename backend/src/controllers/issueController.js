const Issue = require("../models/Issue");

// GET /api/issues
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
    });
  }
};

// POST /api/issues
const createIssue = async (req, res) => {
  try {
    const { type, location } = req.body;

    const issue = await Issue.create({
      type,
      location,
    });

    res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to report issue",
    });
  }
};

module.exports = {
  getAllIssues,
  createIssue,
};
