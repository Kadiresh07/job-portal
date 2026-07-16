const Company = require("../models/Company");
const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/apiResponse");

// POST /api/companies
exports.createCompany = asyncHandler(async (req, res) => {
  const exists = await Company.findOne({ owner: req.user.id });
  if (exists) return error(res, "You already have a company profile", 400);

  const company = await Company.create({ ...req.body, owner: req.user.id });
  success(res, { company }, "Company created", 201);
});

// GET /api/companies
exports.getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().populate("owner", "name email");
  success(res, { companies });
});

// GET /api/companies/:id
exports.getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate("owner", "name email");
  if (!company) return error(res, "Company not found", 404);
  success(res, { company });
});

// PUT /api/companies/:id
exports.updateCompany = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  if (req.user.role !== "admin") query.owner = req.user.id;

  const company = await Company.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
  if (!company) return error(res, "Company not found or unauthorized", 404);
  success(res, { company }, "Company updated");
});

// DELETE /api/companies/:id
exports.deleteCompany = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  if (req.user.role !== "admin") query.owner = req.user.id;

  const company = await Company.findOneAndDelete(query);
  if (!company) return error(res, "Company not found or unauthorized", 404);
  success(res, {}, "Company deleted");
});
