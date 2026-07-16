const { body } = require("express-validator");

exports.createJobValidator = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("workMode")
    .isIn(["Remote", "Hybrid", "Onsite"])
    .withMessage("Invalid work mode"),
  body("employmentType")
    .isIn(["Full-time", "Part-time", "Internship", "Contract"])
    .withMessage("Invalid employment type"),
  body("experience").trim().notEmpty().withMessage("Experience is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];
