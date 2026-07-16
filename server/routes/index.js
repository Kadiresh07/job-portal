const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/companies", require("./companyRoutes"));
router.use("/jobs", require("./jobRoutes"));
router.use("/applications", require("./applicationRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/scrape", require("./scraperRoutes"));
router.use("/admin", require("./adminRoutes"));

module.exports = router;
