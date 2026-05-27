const db = require("../db");

// ================= CREATE COUPON =================
exports.createCoupon = async (req, res, next) => {

  try {

    const {
      code,
      type,
      value,
      product_ids
    } = req.body;

    // validation
    if (
      !code ||
      !type ||
      !value ||
      !product_ids ||
      product_ids.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // insert coupon
    const [couponResult] = await db.query(
      `INSERT INTO coupons
      (code, type, value)
      VALUES (?, ?, ?)`,
      [code, type, value]
    );

    const couponId = couponResult.insertId;

    // map products
    for (let productId of product_ids) {

      await db.query(
        `INSERT INTO coupon_products
        (coupon_id, product_id)
        VALUES (?, ?)`,
        [couponId, productId]
      );

    }

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon_id: couponId
    });

  } catch (err) {

    next(err);

  }

};

// ================= GET ALL COUPONS =================
exports.getCoupons = async (req, res, next) => {

  try {

    const [rows] = await db.query(`
      SELECT
        c.id,
        c.code,
        c.type,
        c.value,
        c.is_active,
        GROUP_CONCAT(cp.product_id) AS product_ids
      FROM coupons c
      LEFT JOIN coupon_products cp
      ON c.id = cp.coupon_id
      GROUP BY c.id
      ORDER BY c.id DESC
    `);

    return res.status(200).json({
      success: true,
      coupons: rows
    });

  } catch (err) {

    next(err);

  }

};

// ================= GET SINGLE COUPON =================
exports.getCouponById = async (req, res, next) => {

  try {

    const [rows] = await db.query(`
      SELECT
        c.id,
        c.code,
        c.type,
        c.value,
        c.is_active,
        GROUP_CONCAT(cp.product_id) AS product_ids
      FROM coupons c
      LEFT JOIN coupon_products cp
      ON c.id = cp.coupon_id
      WHERE c.id=?
      GROUP BY c.id
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    return res.status(200).json({
      success: true,
      coupon: rows[0]
    });

  } catch (err) {

    next(err);

  }

};

// ================= UPDATE COUPON =================
exports.updateCoupon = async (req, res, next) => {

  try {

    const {
      code,
      type,
      value,
      product_ids
    } = req.body;

    // check coupon
    const [checkCoupon] = await db.query(
      "SELECT * FROM coupons WHERE id=?",
      [req.params.id]
    );

    if (checkCoupon.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    // update coupon
    await db.query(
      `UPDATE coupons
      SET code=?, type=?, value=?
      WHERE id=?`,
      [
        code,
        type,
        value,
        req.params.id
      ]
    );

    // delete old mappings
    await db.query(
      "DELETE FROM coupon_products WHERE coupon_id=?",
      [req.params.id]
    );

    // insert new mappings
    for (let productId of product_ids) {

      await db.query(
        `INSERT INTO coupon_products
        (coupon_id, product_id)
        VALUES (?, ?)`,
        [req.params.id, productId]
      );

    }

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully"
    });

  } catch (err) {

    next(err);

  }

};

// ================= DELETE COUPON =================
exports.deleteCoupon = async (req, res, next) => {

  try {

    const [result] = await db.query(
      "DELETE FROM coupons WHERE id=?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully"
    });

  } catch (err) {

    next(err);

  }

};