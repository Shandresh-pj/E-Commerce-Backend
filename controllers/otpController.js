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

    // VALIDATION
    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile is required"
      });
    }

    let registrationId = null;

    // CHECK EMAIL EXISTS IN registration TABLE
    if (email) {

      const [existingUser] = await db.query(
        "SELECT id, email FROM registration WHERE email = ?",
        [email]
      );

      // EMAIL EXISTS
      if (existingUser.length > 0) {

        registrationId = existingUser[0].id;

      } else {

        // CREATE NEW USER
        const [result] = await db.query(
          `INSERT INTO registration
          (email, status)
          VALUES (?, ?)`,
          [email, "Pending"]
        );

        registrationId = result.insertId;
      }
    }

    // GENERATE OTP
    const otp = generateOTP();

    // OTP EXPIRY
    const expiresAt = new Date(
      Date.now() + 1 * 60 * 1000
    );

    // DELETE OLD OTP
    await db.query(
      "DELETE FROM otp_verifications WHERE email = ?",
      [email]
    );

    // INSERT OTP
    await db.query(
      `INSERT INTO otp_verifications
      (
        registration_id,
        email,
        mobile,
        otp,
        expires_at,
        is_used
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        registrationId,
        email || null,
        mobile || null,
        otp,
        expiresAt,
        0
      ]
    );

    // SEND EMAIL OTP
    if (email) {
      await sendEmailOtp(email, otp);
    }

    // SEND SMS OTP
    if (mobile) {
      await sendSmsOtp(mobile, otp);
    }

    // SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // registration_id: registrationId,
      // OTP: otp
    });

  } catch (err) {

    console.error("SEND OTP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
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