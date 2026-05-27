const DataBase = require('../db');
const bcrypt = require('bcryptjs');

exports.forgetpassword = async (req, res, next) => {

    try {

        const { email, oldPassword, newPassword } = req.body;

        // Validation
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, old password and new password are required"
            });
        }

        // Check user exists
        const [rows] = await DataBase.query(
            "SELECT * FROM registration WHERE email=?",
            [email]
        );

        // Email not found
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Email not found"
            });
        }

        const user = rows[0];

        // Compare old password
        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        // Wrong old password
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Old and new password same check
        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from old password"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await DataBase.query(
            "UPDATE registration SET password=? WHERE email=?",
            [hashedPassword, email]
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {

        next(err);

    }

};