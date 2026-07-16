const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { triggerScrape } = require("../controllers/scraperController");

/**
 * @swagger
 * /api/scrape/jobs:
 *   post:
 *     summary: Trigger job scraping
 *     description: Manually trigger the external job scraper to aggregate new jobs.
 *     tags: [Scraper]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scraping process initiated successfully
 */

router.post("/jobs", protect, authorize("admin"), triggerScrape);

module.exports = router;
