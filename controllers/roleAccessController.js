const db = require("../db");

exports.createRoleAccess = async (req, res, next) => {
    try {

        const {
            role_name,
            module_name,
            can_view,
            can_add,
            can_edit,
            can_delete
        } = req.body;

        if (!role_name || !module_name) {
            return res.status(400).json({
                success: false,
                message: 'Role Name and Module Name are required'
            });
        }

        const [exists] = await db.query(
            `SELECT id
             FROM role_access
             WHERE role_name = ?
             AND module_name = ?`,
            [role_name, module_name]
        );

        if (exists.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Role access already exists'
            });
        }

        const [result] = await db.query(
            `INSERT INTO role_access
            (
                role_name,
                module_name,
                can_view,
                can_add,
                can_edit,
                can_delete
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                role_name,
                module_name,
                can_view || 0,
                can_add || 0,
                can_edit || 0,
                can_delete || 0
            ]
        );

        return res.status(201).json({
            success: true,
            message: 'Role access created successfully',
            id: result.insertId
        });

    } catch (err) {
        next(err);
    }
};

exports.getAllRoleAccess = async (req, res, next) => {
    try {

        const [rows] = await db.query(
            `SELECT *
             FROM role_access
             ORDER BY id DESC`
        );

        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (err) {
        next(err);
    }
};

exports.getRoleAccessByRole = async (req, res, next) => {
    try {

        const { role_name } = req.params;

        const [rows] = await db.query(
            `SELECT *
             FROM role_access
             WHERE role_name = ?`,
            [role_name]
        );

        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (err) {
        next(err);
    }
};

exports.getRoleAccessById = async (req, res, next) => {
    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT *
             FROM role_access
             WHERE id = ?`,
            [id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'Role access not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (err) {
        next(err);
    }
};

exports.updateRoleAccess = async (req, res, next) => {
    try {

        const { id } = req.params;

        const {
            role_name,
            module_name,
            can_view,
            can_add,
            can_edit,
            can_delete
        } = req.body;

        await db.query(
            `UPDATE role_access
             SET
                role_name = ?,
                module_name = ?,
                can_view = ?,
                can_add = ?,
                can_edit = ?,
                can_delete = ?
             WHERE id = ?`,
            [
                role_name,
                module_name,
                can_view,
                can_add,
                can_edit,
                can_delete,
                id
            ]
        );

        return res.status(200).json({
            success: true,
            message: 'Role access updated successfully'
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteRoleAccess = async (req, res, next) => {
    try {

        const { id } = req.params;

        await db.query(
            'DELETE FROM role_access WHERE id = ?',
            [id]
        );

        return res.status(200).json({
            success: true,
            message: 'Role access deleted successfully'
        });

    } catch (err) {
        next(err);
    }
};