const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/apiResponse");

// POST /api/applications/:jobId/apply or /api/jobs/:id/apply
exports.applyJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId || req.params.id;

  const job = await Job.findOne({ _id: jobId, status: "Open" });
  if (!job) return error(res, "Job not found or closed", 404);

  const already = await Application.findOne({ job: jobId, candidate: req.user.id });
  if (already) return error(res, "Already applied to this job", 400);

  const resumePath = req.file ? req.file.path : req.body.resume;
  if (!resumePath) return error(res, "Resume is required", 400);

  const application = await Application.create({
    job: jobId,
    candidate: req.user.id,
    resume: resumePath,
    coverLetter: req.body.coverLetter || "",
  });

  success(res, { application }, "Application submitted", 201);
});

// GET /api/applications/my  — candidate's applications
exports.myApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user.id })
    .populate({ path: "job", populate: { path: "company", select: "name logo" } });
  success(res, { applications });
});

// GET /api/applications/job/:jobId  — employer sees applicants for a job
exports.jobApplications = asyncHandler(async (req, res) => {
  const query = { _id: req.params.jobId };
  if (req.user.role !== "admin") query.createdBy = req.user.id;

  const job = await Job.findOne(query);
  if (!job) return error(res, "Job not found or unauthorized", 404);

  const applications = await Application.find({ job: req.params.jobId })
    .populate("candidate", "name email phone");
  success(res, { applications });
});

// PATCH /api/applications/:id/status  — employer updates status
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];
  if (!allowed.includes(status)) return error(res, "Invalid status", 400);

  const application = await Application.findById(req.params.id).populate("job");
  if (!application) return error(res, "Application not found", 404);

  if (req.user.role !== "admin" && String(application.job.createdBy) !== req.user.id) {
    return error(res, "Unauthorized", 403);
  }

  application.status = status;
  await application.save();
  success(res, { application }, "Status updated");
});

// POST /api/jobs/:jobId/save
exports.saveJob = asyncHandler(async (req, res) => {
  const already = await SavedJob.findOne({ job: req.params.jobId, candidate: req.user.id });
  if (already) return error(res, "Job already saved", 400);

  const saved = await SavedJob.create({ job: req.params.jobId, candidate: req.user.id });
  success(res, { saved }, "Job saved", 201);
});

// DELETE /api/jobs/:jobId/save
exports.unsaveJob = asyncHandler(async (req, res) => {
  await SavedJob.findOneAndDelete({ job: req.params.jobId, candidate: req.user.id });
  success(res, {}, "Job unsaved");
});

// GET /api/jobs/saved
exports.savedJobs = asyncHandler(async (req, res) => {
  const saved = await SavedJob.find({ candidate: req.user.id })
    .populate({ path: "job", populate: { path: "company", select: "name logo" } });
  success(res, { saved });
});
