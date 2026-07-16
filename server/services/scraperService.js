const Job = require("../models/Job");

/**
 * Simulated scraper — replace the `scrapedJobs` array with real HTTP calls
 * to any job board API (e.g. JSearch, Adzuna, RemoteOK).
 *
 * Each scraped job must include a unique `sourceUrl` to prevent duplicates.
 */
async function scrapeJobs() {
  // Real scraping logic using Remotive API
  let scrapedJobs = [];
  try {
    const response = await fetch("https://remotive.com/api/remote-jobs?limit=20");
    const data = await response.json();
    
    if (data && data.jobs) {
      scrapedJobs = data.jobs.map(job => {
        // Map employment type
        let empType = "Full-time";
        if (job.job_type === "contract") empType = "Contract";
        else if (job.job_type === "part_time") empType = "Part-time";
        else if (job.job_type === "internship") empType = "Internship";

        return {
          title: job.title || "Unknown Title",
          location: job.candidate_required_location || "Remote",
          workMode: "Remote", // Remotive is mostly remote
          employmentType: empType,
          salary: job.salary || "Not Disclosed",
          experience: "Not specified",
          skills: job.tags && Array.isArray(job.tags) ? job.tags.slice(0, 5) : [], // keep top 5
          description: job.description || "No description provided.",
          sourceUrl: job.url,
        };
      });
    }
  } catch (error) {
    console.error("[Scraper] Error fetching from Remotive API:", error.message);
  }


  let inserted = 0;
  let skipped = 0;

  for (const jobData of scrapedJobs) {
    const exists = await Job.findOne({ sourceUrl: jobData.sourceUrl });
    if (exists) {
      skipped++;
      continue;
    }

    // Scraped jobs need a company ref — use a sentinel ObjectId or
    // look up a default "scraped" company in your DB.
    // For now we skip jobs without a valid company rather than error.
    const mongoose = require("mongoose");
    const SCRAPED_COMPANY_ID = process.env.SCRAPED_COMPANY_ID;
    const SCRAPED_USER_ID = process.env.SCRAPED_USER_ID;

    if (!SCRAPED_COMPANY_ID || !SCRAPED_USER_ID) {
      console.warn("SCRAPED_COMPANY_ID / SCRAPED_USER_ID not set — skipping scraped job insert");
      skipped++;
      continue;
    }

    await Job.create({
      ...jobData,
      company: new mongoose.Types.ObjectId(SCRAPED_COMPANY_ID),
      createdBy: new mongoose.Types.ObjectId(SCRAPED_USER_ID),
      isScraped: true,
    });

    inserted++;
  }

  console.log(`[Scraper] inserted=${inserted} skipped=${skipped}`);
  return { inserted, skipped };
}

module.exports = { scrapeJobs };
