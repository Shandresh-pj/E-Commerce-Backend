const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");
const { createHelpAndSupport, updateHelpAndSupport, deleteHelpAndSupport, getHelpAndSupport } = require("../controllers/help&supportController");


 /**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: Send OTP to email or mobile
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Email or mobile required
 */
router.post("/send-otp", otpController.sendOtp);


 /**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP (one-time use)
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", otpController.verifyOtp);



/**
 * @swagger
 * /help-support:
 *   post:
 *     summary: help-support
 *     tags: [HELP & SUPPORT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Help & Support created successfully
 *       400:
 *         description: Email or mobile required
 */
router.post("/help-support", createHelpAndSupport);


/**
 * @swagger
 * /help-support/{id}:
 *   put:
 *     summary: help-support
 *     tags: [HELP & SUPPORT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Help & Support updated successfully
 *       400:
 *         description: Email or mobile required
 */
router.put("/help-support/:id", updateHelpAndSupport);

/**
 * @swagger
 * /help-support/{id}:
 *   delete:
 *     summary: help-support
 *     tags: [HELP & SUPPORT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Help & Support deleted successfully
 *       400:
 *         description: Email or mobile required
 */
router.delete("/help-support/:id", deleteHelpAndSupport);

/**
 * @swagger
 * /help-support/all:
 *   get:
 *     summary: Get all HelpAndSupport
 *     tags: [HELP & SUPPORT]
 *     responses:
 *       200:
 *         description: List of Data
 */
router.get("/help-support/all", getHelpAndSupport);





module.exports = router;