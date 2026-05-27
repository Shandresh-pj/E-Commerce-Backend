const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// ------------------ GET PROFILE ----------------
exports.getProfile = async (req, res, next) => {

  try {

    const { id } = req.body || {};

    // Validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Get user
    const [rows] = await db.query(
      `SELECT 
        id,
        name,
        email,
        image,
        mobilenumber,
        address,
        usertype,
        status,
        logintype
      FROM registration 
      WHERE id = ?`,
      [id]
    );

    // User not found
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      user: rows[0]
    });

  } catch (err) {

    next(err);

  }

}; 

// ------------------ UPDATE PROFILE ----------------
exports.updateProfile = async (req, res, next) => {

    try {

        const {
            id,
            name,
            email,
            mobilenumber,
            address
        } = req.body || {};

        // Validation
        if (
            !id ||
            !name ||
            !email ||
            !mobilenumber ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Update user
        const [result] = await db.query(
            `UPDATE registration 
             SET name=?, email=?, mobilenumber=?, address=? 
             WHERE id=?`,
            [name, email, mobilenumber, address, id]
        );

        // User not found
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "Profile has been updated"
        });

    } catch (err) {

        next(err);

    }

};

exports.deactiveProfile = async (req, res, next) => {

    try {

        const { id } = req.body || {};

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const [result] = await db.query(
            "DELETE FROM registration WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (err) {

        next(err);

    }

};
