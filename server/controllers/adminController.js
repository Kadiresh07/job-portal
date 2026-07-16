const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

// GET /api/admin/applications
exports.getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate("candidate", "name email")
    .populate({
      path: "job",
      select: "title",
      populate: { path: "company", select: "name" },
    })
    .sort("-createdAt");

  success(res, { applications });
});

// GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt");
  success(res, { users });
});

// GET /api/admin/companies
exports.getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().populate("owner", "name email").sort("-createdAt");
  success(res, { companies });
});

// GET /api/admin/jobs
exports.getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find()
    .populate("company", "name")
    .populate("createdBy", "name email")
    .sort("-createdAt");
  success(res, { jobs });
});
