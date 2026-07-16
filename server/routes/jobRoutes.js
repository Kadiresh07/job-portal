const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { createJobValidator } = require("../validators/jobValidator");
const validate = require("../middleware/validate");
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  closeJob,
} = require("../controllers/jobController");
const {
  saveJob,
  unsaveJob,
  savedJobs,
  applyJob,
} = require("../controllers/applicationController");

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Retrieve a list of all jobs with optional filtering, sorting, and pagination.
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search by job title or keyword
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Search by location
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *   post:
 *     summary: Create a new job
 *     description: Create a new job listing. Accessible by employers and admins.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - company
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Software Engineer"
 *               description:
 *                 type: string
 *                 example: "We are looking for a skilled engineer."
 *               company:
 *                 type: string
 *                 example: "Company ID here"
 *               location:
 *                 type: string
 *                 example: "Remote"
 *               salary:
 *                 type: number
 *                 example: 100000
 *               jobType:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract, Internship]
 *                 example: "Full-time"
 *     responses:
 *       201:
 *         description: Job created successfully
 * 
 * /api/jobs/saved:
 *   get:
 *     summary: Get saved jobs
 *     description: Retrieve all jobs saved by the currently authenticated candidate.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of saved jobs
 * 
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a specific job
 *     description: Retrieve details of a specific job by ID.
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 *   put:
 *     summary: Update a job
 *     description: Update an existing job listing. Accessible by employers and admins.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 *   delete:
 *     summary: Delete a job
 *     description: Delete a job listing. Accessible by employers and admins.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 * 
 * /api/jobs/{id}/close:
 *   patch:
 *     summary: Close a job
 *     description: Mark a job listing as closed. Accessible by employers and admins.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job closed successfully
 *       404:
 *         description: Job not found
 * 
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Apply for a job
 *     description: Apply for a specific job. Accessible by candidates. Candidates can upload a resume.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file upload
 *               coverLetter:
 *                 type: string
 *                 description: Cover letter text
 *     responses:
 *       201:
 *         description: Successfully applied
 *       400:
 *         description: Already applied or bad request
 * 
 * /api/jobs/{jobId}/save:
 *   post:
 *     summary: Save a job
 *     description: Save a job for later viewing. Accessible by candidates.
 *     tags: [Jobs]
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
 *         description: Job saved successfully
 *   delete:
 *     summary: Unsave a job
 *     description: Remove a saved job. Accessible by candidates.
 *     tags: [Jobs]
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
 *         description: Job unsaved successfully
 */
router.get("/", getJobs);
router.get("/saved", protect, authorize("candidate"), savedJobs);
router.get("/:id", getJob);
router.post("/", protect, authorize("employer", "admin"), createJobValidator, validate, createJob);
router.put("/:id", protect, authorize("employer", "admin"), updateJob);
router.delete("/:id", protect, authorize("employer", "admin"), deleteJob);
router.patch("/:id/close", protect, authorize("employer", "admin"), closeJob);
router.post("/:id/apply", protect, authorize("candidate"), upload.single("resume"), applyJob);
router.post("/:jobId/save", protect, authorize("candidate"), saveJob);
router.delete("/:jobId/save", protect, authorize("candidate"), unsaveJob);

module.exports = router;
