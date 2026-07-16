const Job = require("../models/Job");
const Company = require("../models/Company");
const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/apiResponse");

// POST /api/jobs
exports.createJob = asyncHandler(async (req, res) => {
  let companyId;

  if (req.user.role === "admin") {
    // Admin must supply a companyId in the request body
    if (!req.body.companyId) {
      return error(res, "Admin must provide a companyId to post a job", 400);
    }
    const company = await Company.findById(req.body.companyId);
    if (!company) return error(res, "Company not found", 404);
    companyId = company._id;
  } else {
    // Employer auto-resolves their own company
    const company = await Company.findOne({ owner: req.user.id });
    if (!company) {
      return error(res, "You must create a company profile before posting a job", 400);
    }
    companyId = company._id;
  }

  const { companyId: _removed, ...jobData } = req.body;
  const job = await Job.create({
    ...jobData,
    company: companyId,
    createdBy: req.user.id,
  });
  success(res, { job }, "Job created", 201);
});

// GET /api/jobs  — search, filter, paginate, sort
exports.getJobs = asyncHandler(async (req, res) => {
  const {
    search,
    location,
    workMode,
    employmentType,
    status = "Open",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const filter = { status };

  if (search) {
    filter.$text = { $search: search };
  }
  if (location) filter.location = { $regex: location, $options: "i" };
  if (workMode) filter.workMode = workMode;
  if (employmentType) filter.employmentType = employmentType;

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("company", "name logo location")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(filter),
  ]);

  success(res, {
    jobs,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

// GET /api/jobs/:id
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("company")
    .populate("createdBy", "name email");
  if (!job) return error(res, "Job not found", 404);
  success(res, { job });
});

// PUT /api/jobs/:id
exports.updateJob = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  if (req.user.role !== "admin") query.createdBy = req.user.id;

  const job = await Job.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
  if (!job) return error(res, "Job not found or unauthorized", 404);
  success(res, { job }, "Job updated");
});

// DELETE /api/jobs/:id
exports.deleteJob = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  if (req.user.role !== "admin") query.createdBy = req.user.id;

  const job = await Job.findOneAndDelete(query);
  if (!job) return error(res, "Job not found or unauthorized", 404);
  success(res, {}, "Job deleted");
});

// PATCH /api/jobs/:id/close
exports.closeJob = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  if (req.user.role !== "admin") query.createdBy = req.user.id;

  const job = await Job.findOneAndUpdate(query, { status: "Closed" }, { new: true });
  if (!job) return error(res, "Job not found or unauthorized", 404);
  success(res, { job }, "Job closed");
});
