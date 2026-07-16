const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { employerDashboard, candidateDashboard, adminDashboard } = require("../controllers/dashboardController");

/**
 * @swagger
 * /api/dashboard/employer:
 *   get:
 *     summary: Get employer dashboard data
 *     description: Retrieve statistics and metrics for the employer dashboard.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employer dashboard statistics
 * 
 * /api/dashboard/candidate:
 *   get:
 *     summary: Get candidate dashboard data
 *     description: Retrieve statistics and metrics for the candidate dashboard.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate dashboard statistics
 * 
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Retrieve statistics and metrics for the admin dashboard.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics
 */

router.get("/employer", protect, authorize("employer"), employerDashboard);
router.get("/candidate", protect, authorize("candidate"), candidateDashboard);
router.get("/admin", protect, authorize("admin"), adminDashboard);

module.exports = router;
