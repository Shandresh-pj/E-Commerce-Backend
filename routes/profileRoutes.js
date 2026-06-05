const express = require("express");
const { updateProfile, deactiveProfile, getProfile, getAllProfiles, createProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const router = express.Router();



/**
 * @swagger
 * /profile/add:
 *   post:
 *     summary: Create Profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - mobilenumber
 *               - address
 *               - usertype
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *               mobilenumber:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: Madurai, Tamil Nadu
 *               usertype:
 *                 type: string
 *                 example: Super_Admin
 *               status:
 *                 type: string
 *                 example: Active
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/profile/add', upload.fields([ { name: "image", maxCount: 1 }]), createProfile);





/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get Profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobilenumber:
 *                 type: string
 *               address:
 *                 type: string
 *       
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /profile/all:
 *   get:
 *     summary: Get All Profiles
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobilenumber:
 *                 type: string
 *               address:
 *                 type: string
 *       
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get("/profile/all", authMiddleware, getAllProfiles);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update Profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobilenumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile Updated successfully
 */
router.put('/profile/update', upload.fields([ { name: "image", maxCount: 1 }]), updateProfile);
router.post('/profile/update', upload.fields([ { name: "image", maxCount: 1 }]), updateProfile);
// router.put("/profile/update", authMiddleware,  upload.fields([
//     { name: "image", maxCount: 1 }]), updateProfile );


/**
 * @swagger
 * /profile/delete:
 *   delete:
 *     summary: Delete profile by ID
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 */
// router.delete("/profile/delete/:id", deactiveProfile );
router.delete("/products/:id", deactiveProfile);



module.exports = router;