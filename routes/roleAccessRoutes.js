const express = require('express');
const router = express.Router();

const roleAccessController = require('../controllers/roleAccessController');

/**
 * @swagger
 * tags:
 *   name: Role Access
 */

/**
 * @swagger
 * /role/role-access/add:
 *   post:
 *     summary: Create Role Access
 *     tags: [Role Access]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - module_name
 *             properties:
 *               role_id:
 *                 type: integer
 *                 example: 1
 *                 description: 1=Super Admin, 2=Admin, 3=Employee, 4=Customer
 *               module_name:
 *                 type: string
 *                 example: Users
 *               can_view:
 *                 type: integer
 *                 example: 1
 *               can_add:
 *                 type: integer
 *                 example: 1
 *               can_edit:
 *                 type: integer
 *                 example: 1
 *               can_delete:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Role access created successfully
 *       400:
 *         description: Validation error
 */
router.post('/role/role-access/add', roleAccessController.createRoleAccess);

/**
 * @swagger
 * /role/role-access:
 *   get:
 *     summary: Get All Role Access
 *     tags: [Role Access]
 *     responses:
 *       200:
 *         description: List of role access records
 */
router.get('/role/role-access', roleAccessController.getAllRoleAccess);

/**
 * @swagger
 * role-access/{role_id}:
 *   get:
 *     summary: Get Role Access By Role ID
 *     tags: [Role Access]
 *     parameters:
 *       - in: path
 *         name: role_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Role access details
 *       404:
 *         description: Role not found
 */
router.get('/role-access/:role_id', roleAccessController.getRoleAccessByRole);

/**
 * @swagger
 * role-access/{id}:
 *   get:
 *     summary: Get Role Access By ID
 *     tags: [Role Access]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Role access record
 *       404:
 *         description: Record not found
 */
router.get('role-access/:id', roleAccessController.getRoleAccessById);

/**
 * @swagger
 * role-access/update/{id}:
 *   put:
 *     summary: Update Role Access
 *     tags: [Role Access]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_id:
 *                 type: integer
 *                 example: 2
 *               module_name:
 *                 type: string
 *                 example: Users
 *               can_view:
 *                 type: integer
 *                 example: 1
 *               can_add:
 *                 type: integer
 *                 example: 1
 *               can_edit:
 *                 type: integer
 *                 example: 1
 *               can_delete:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Role access updated successfully
 */
router.put('/role-access/update/:id', roleAccessController.updateRoleAccess);

/**
 * @swagger
 * role-access/{id}:
 *   delete:
 *     summary: Delete Role Access
 *     tags: [Role Access]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Role access deleted successfully
 *       404:
 *         description: Record not found
 */
router.delete('/role-access/:id', roleAccessController.deleteRoleAccess);

module.exports = router;