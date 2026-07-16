const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  myApplications,
  jobApplications,
  updateStatus,
} = require("../controllers/applicationController");

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get my applications
 *     description: Candidate sees their own applications.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of candidate's applications
 * 
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applicants for a job
 *     description: Employer sees applicants for their specific job.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID
 *     responses:
 *       200:
 *         description: A list of applications for the job
 * 
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     description: Employer updates the status of an application (e.g., accepted, rejected).
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, accepted, rejected]
 *                 example: "accepted"
 *     responses:
 *       200:
 *         description: Application status updated
 */

// candidate sees their own applications
router.get("/", protect, authorize("candidate"), myApplications);

// employer sees applicants for their job
router.get("/job/:jobId", protect, authorize("employer", "admin"), jobApplications);

// employer updates application status
router.patch("/:id/status", protect, authorize("employer", "admin"), updateStatus);

module.exports = router;
