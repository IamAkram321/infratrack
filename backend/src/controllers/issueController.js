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

    if (!type || !location) {
      return res.status(400).json({
        success: false,
        message: "Type and location are required",
      });
    }

    // duplicate detection window (last 24 hours)
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const existingIssue = await Issue.findOne({
      type,
      location,
      status: { $ne: "fixed" },
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (existingIssue) {
      return res.status(409).json({
        success: false,
        message: "Similar issue already reported recently",
        data: existingIssue,
      });
    }

    const issue = await Issue.create({ type, location });

    res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};


// PATCH /api/issues/:id/status
const updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["reported", "in_progress", "fixed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllIssues,
  createIssue,
  updateIssueStatus,
};
