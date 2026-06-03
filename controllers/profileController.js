const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// ------------------ GET PROFILE ----------------
exports.getProfile = async (req, res, next) => {

    try {

        const id =
            req.user?.id ||
            req.query?.id ||
            req.body?.id ||
            req.params?.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

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
             WHERE id=?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

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

        const id = req.user?.id || req.body?.id;

        const { name, email, mobilenumber, address } = req.body;

        // Validation
        if (!id || !name || !email || !mobilenumber || !address) {
            return res.status(400).json({
                success: false,
                message: "name, email, mobilenumber, address are required"
            });
        }

        // Get existing user image
        const [existingUser] = await db.query(
            `SELECT image FROM registration WHERE id=?`,
            [id]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // If new image uploaded
        let image = existingUser[0].image;

        if (req.files?.image?.[0]) {
            image = `${req.protocol}://${req.get("host")}/uploads/${req.files.image[0].filename}`;
        }

        // Update query
        const [result] = await db.query(
            `UPDATE registration 
             SET 
                name=?,
                email=?,
                mobilenumber=?,
                address=?,
                image=?
             WHERE id=?`,
            [name, email, mobilenumber, address, image, id]
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id,
                name,
                email,
                mobilenumber,
                address,
                image
            }
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
