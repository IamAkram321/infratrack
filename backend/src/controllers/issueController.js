const getAllIssues = (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: "List of infrastructure issues (placeholder)",
  });
};

const createIssue = (req, res) => {
  const { type, location } = req.body;

  res.status(201).json({
    success: true,
    message: "Issue reported successfully (placeholder)",
    data: {
      type,
      location,
    },
  });
};

module.exports = {
  getAllIssues,
  createIssue,
};
