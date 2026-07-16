const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAllApplications,
  getAllUsers,
  getAllCompanies,
  getAllJobs,
} = require("../controllers/adminController");

/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     summary: Get all applications (Admin)
 *     description: Retrieve all applications across the platform. Accessible only by admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all applications
 * 
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin)
 *     description: Retrieve all registered users. Accessible only by admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users
 * 
 * /api/admin/companies:
 *   get:
 *     summary: Get all companies (Admin)
 *     description: Retrieve all companies across the platform. Accessible only by admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all companies
 * 
 * /api/admin/jobs:
 *   get:
 *     summary: Get all jobs (Admin)
 *     description: Retrieve all jobs across the platform. Accessible only by admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all jobs
 */

// All routes here require admin access
router.use(protect, authorize("admin"));

router.get("/applications", getAllApplications);
router.get("/users", getAllUsers);
router.get("/companies", getAllCompanies);
router.get("/jobs", getAllJobs);

module.exports = router;
