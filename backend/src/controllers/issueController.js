const Issue = require("../models/Issue");

const getSeverityFromType = (type) => {
  switch (type) {
    case "electric_pole":
    case "manhole":
      return "high";
    case "pothole":
      return "medium";
    case "streetlight":
      return "low";
    default:
      return "low";
  }
};

const severityScoreMap = {
  low: 1,
  medium: 2,
  high: 3,
};

// GET /api/issues
const getAllIssues = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, status, severity } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // safety caps
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (severity) {
      filter.severity = severity;
    }

    //  not showing fixed issues by default
    if (!status) {
      filter.status = { $ne: "fixed" };
    }

    const skip = (page - 1) * limit;

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .sort({ priorityScore: -1, createdAt: 1 })
        .skip(skip)
        .limit(limit),
      Issue.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
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

    //severity logic
    const severity = getSeverityFromType(type);
    const priorityScore = severityScoreMap[severity];

    const issue = await Issue.create({
      type,
      location,
      severity,
      priorityScore,
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
