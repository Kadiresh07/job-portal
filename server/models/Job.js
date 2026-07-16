const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      required: true,
    },
    salary: {
      type: String,
      default: "Not Disclosed",
    },
    experience: {
      type: String,
      required: true,
    },
    skills: [{ type: String }],
    description: {
      type: String,
      required: true,
    },
    benefits: [{ type: String }],
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // for scraper-sourced jobs
    sourceUrl: {
      type: String,
      default: "",
    },
    isScraped: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// text index for search
jobSchema.index({ title: "text", description: "text", skills: "text" });

module.exports = mongoose.model("Job", jobSchema);
