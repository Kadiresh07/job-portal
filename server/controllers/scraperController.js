const { scrapeJobs } = require("../services/scraperService");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

// POST /api/scrape/jobs
exports.triggerScrape = asyncHandler(async (req, res) => {
  const result = await scrapeJobs();
  success(res, { result }, `Scrape complete — ${result.inserted} new jobs added`);
});
