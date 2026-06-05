const db = require('../db');

exports.checkPermission = (moduleName, permission) => {
    return async (req, res, next) => {

        try {

            const userRole = req.user.usertype;

            const [rows] = await db.query(
                `SELECT *
                 FROM role_access
                 WHERE role_name = ?
                 AND module_name = ?`,
                [userRole, moduleName]
            );

            if (!rows.length) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const access = rows[0];

            if (!access[permission]) {
                return res.status(403).json({
                    success: false,
                    message: 'Permission denied'
                });
            }

            next();

        } catch (error) {
            next(error);
        }
    };
};