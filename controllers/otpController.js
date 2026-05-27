const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailOtp = require("../utils/sendEmailOtp");
const sendSmsOtp = require("../utils/sendSmsOtp");

// generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

exports.sendOtp = async (req, res, next) => {
  try {

    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile is required"
      });
    }

    const otp = generateOTP();

    const expiresAt = new Date(
      Date.now() + 1 * 60 * 1000
    );

    await db.query(
      `INSERT INTO otp_verifications
      (email, mobile, otp, expires_at)
      VALUES (?, ?, ?, ?)`,
      [email || null, mobile || null, otp, expiresAt]
    );

    // SEND EMAIL
    if (email) {
      await sendEmailOtp(email, otp);
    }

    // SEND SMS
    if (mobile) {
      await sendSmsOtp(mobile, otp);
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err) {
    next(err);
  }
};


exports.verifyOtp = async (req, res, next) => {

  try {

    const { email, mobile, otp } = req.body;

    // validation
    if ((!email && !mobile) || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and OTP required"
      });
    }

    // check otp
    const [rows] = await db.query(
      `SELECT * FROM otp_verifications
       WHERE (email = ? OR mobile = ?)
       AND otp = ?
       AND is_used = 0
       ORDER BY id DESC
       LIMIT 1`,
      [
        email || null,
        mobile || null,
        otp
      ]
    );

    // invalid otp
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    const record = rows[0];

    // check expiry
    if (new Date(record.expires_at) < new Date()) {

      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });

    }

    // mark otp used
    await db.query(
      `UPDATE otp_verifications
       SET is_used = 1
       WHERE id = ?`,
      [record.id]
    );

    // optional jwt token
    const token = jwt.sign(
      {
        email: record.email,
        mobile: record.mobile
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    // success
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token
    });

  } catch (err) {

    next(err);

  }

};