const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     description: Retrieve a list of all registered companies.
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: A list of companies
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
 *     summary: Create a company
 *     description: Create a new company profile. Accessible by employers and admins.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Corp"
 *               description:
 *                 type: string
 *                 example: "A leading technology company."
 *               website:
 *                 type: string
 *                 example: "https://techcorp.example.com"
 *               location:
 *                 type: string
 *                 example: "San Francisco, CA"
 *     responses:
 *       201:
 *         description: Company created successfully
 * 
 * /api/companies/{id}:
 *   get:
 *     summary: Get a specific company
 *     description: Retrieve details of a specific company by ID.
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 *   put:
 *     summary: Update a company
 *     description: Update an existing company profile. Accessible by employers and admins.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       404:
 *         description: Company not found
 *   delete:
 *     summary: Delete a company
 *     description: Delete a company profile. Accessible by employers and admins.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 */
router.get("/", getCompanies);
router.get("/:id", getCompany);
router.post("/", protect, authorize("employer", "admin"), createCompany);
router.put("/:id", protect, authorize("employer", "admin"), updateCompany);
router.delete("/:id", protect, authorize("employer", "admin"), deleteCompany);

module.exports = router;
