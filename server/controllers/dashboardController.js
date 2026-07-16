const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const Company = require("../models/Company");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

// GET /api/dashboard/employer
exports.employerDashboard = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user.id });

  const [totalJobs, openJobs, closedJobs, recentJobs] = await Promise.all([
    Job.countDocuments({ createdBy: req.user.id }),
    Job.countDocuments({ createdBy: req.user.id, status: "Open" }),
    Job.countDocuments({ createdBy: req.user.id, status: "Closed" }),
    Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).limit(5).populate("company", "name"),
  ]);

  const jobIds = await Job.find({ createdBy: req.user.id }).distinct("_id");
  const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

  success(res, { company, stats: { totalJobs, openJobs, closedJobs, totalApplications }, recentJobs });
});

// GET /api/dashboard/candidate
exports.candidateDashboard = asyncHandler(async (req, res) => {
  const [totalApplications, recentApplications] = await Promise.all([
    Application.countDocuments({ candidate: req.user.id }),
    Application.find({ candidate: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "job", populate: { path: "company", select: "name logo" } }),
  ]);

  const statusBreakdown = await Application.aggregate([
    { $match: { candidate: req.user.id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  success(res, { stats: { totalApplications }, statusBreakdown, recentApplications });
});

// GET /api/dashboard/admin
exports.adminDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalJobs, totalApplications, totalCompanies] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Company.countDocuments(),
  ]);

  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  success(res, { stats: { totalUsers, totalJobs, totalApplications, totalCompanies }, usersByRole });
});
