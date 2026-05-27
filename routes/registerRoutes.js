const express = require("express");

const router = express.Router();

const {
  register,
  login
} = require("../controllers/registerController");
const upload = require("../middleware/upload");
const { forgetpassword } = require("../controllers/forgetpasswordController");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register User
 *     tags: [Authentication]
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/register", upload.single("image"), register);


/**
 * @swagger
 * /login:
 *   get:
 *     summary: Login User
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.get("/login", login);


/**
 * @swagger
 * /UpdatePassword:
 *   put:
 *     summary: Update Password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password Update Successful
 */
router.put("/UpdatePassword", forgetpassword);



module.exports = router;