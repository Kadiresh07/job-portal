require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");
const cron = require("node-cron");
const { scrapeJobs } = require("./services/scraperService");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    // Schedule scraper every 6 hours
    cron.schedule("0 */6 * * *", async () => {
      console.log("[Cron] Running job scraper...");
      try {
        await scrapeJobs();
      } catch (err) {
        console.error("[Cron] Scraper error:", err.message);
      }
    });

    console.log("✅ Cron job scheduled (every 6 hours)");
  } catch (error) {
    console.warn("Database connection skipped:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
