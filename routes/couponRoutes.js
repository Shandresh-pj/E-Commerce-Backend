const router = require("express").Router();

const couponController = require("../controllers/couponController");


/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - type
 *               - value
 *               - product_ids
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE10
 *               type:
 *                 type: string
 *                 example: percent
 *               value:
 *                 type: number
 *                 example: 10
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2,3]
 *     responses:
 *       201:
 *         description: Coupon created successfully
 */
router.post(
  "/coupons",
  couponController.createCoupon
);

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of coupons
 */
router.get(
  "/coupons",
  couponController.getCoupons
);

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Coupon details
 *       404:
 *         description: Coupon not found
 */
router.get(
  "/coupons/:id",
  couponController.getCouponById
);

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Update coupon
 *     tags: [Coupons]
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
 *               code:
 *                 type: string
 *                 example: SAVE20
 *               type:
 *                 type: string
 *                 example: flat
 *               value:
 *                 type: number
 *                 example: 200
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,4]
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       404:
 *         description: Coupon not found
 */
router.put(
  "/coupons/:id",
  couponController.updateCoupon
);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Delete coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 */
router.delete(
  "/coupons/:id",
  couponController.deleteCoupon
);

module.exports = router;