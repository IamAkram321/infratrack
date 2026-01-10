const Issue = require("../models/Issue");

// GET /api/issues
const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/issues
const createIssue = async (req, res, next) => {
  try {
    const { type, location } = req.body;

    // validation
    if (!type || !location) {
      return res.status(400).json({
        success: false,
        message: "Type and location are required",
      });
    }

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
    next(error);
  }
};

module.exports = {
  getAllIssues,
  createIssue,
};
