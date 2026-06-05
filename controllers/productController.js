const pool = require("../db");
const path = require("path");
const fs = require("fs");

// GET all products
exports.getProducts = async (req, res, next) => {
  try {

    const [products] = await pool.query(`
      SELECT
        p.*,
        r.id AS creator_id,
        r.name AS creator_name,
        r.email AS creator_email,
        r.mobilenumber AS creator_mobile
      FROM products_table p
      LEFT JOIN registration r
        ON p.registration_id = r.id
      ORDER BY p.id DESC
    `);

    const [couponRows] = await pool.query(`
      SELECT
        cp.product_id,
        c.code,
        c.type,
        c.value
      FROM coupon_products cp
      JOIN coupons c
        ON cp.coupon_id = c.id
      WHERE c.is_active = 1
    `);

    const finalProducts = products.map(product => {

      const coupon = couponRows.find(
        c => c.product_id === product.id
      );

      let discount_price = Number(product.price);

      if (coupon) {

        if (coupon.type === "percent") {

          discount_price =
            Number(product.price) -
            (
              Number(product.price) *
              Number(coupon.value)
            ) / 100;

        }

        if (coupon.type === "flat") {

          discount_price =
            Number(product.price) -
            Number(coupon.value);

        }

      }

      return {

        ...product,

        image: product.image || null,

        images: product.images
          ? JSON.parse(product.images)
          : [],

        creator: {
          id: product.creator_id,
          name: product.creator_name,
          email: product.creator_email,
          mobile: product.creator_mobile
        },

        coupon: coupon || null,

        discount_price

      };

    });

    return res.status(200).json({
      success: true,
      totalRecords: finalProducts.length,
      products: finalProducts
    });

  } catch (err) {
    next(err);
  }
};

// GET product by ID
exports.getProductById = async (req, res, next) => {
  try {

    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT
        p.*,
        r.id AS creator_id,
        r.name AS creator_name,
        r.email AS creator_email,
        r.mobilenumber AS creator_mobile
      FROM products_table p
      LEFT JOIN registration r
        ON p.registration_id = r.id
      WHERE p.id = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = rows[0];

    const [couponRows] = await pool.query(`
      SELECT
        c.id,
        c.code,
        c.type,
        c.value
      FROM coupon_products cp
      JOIN coupons c
        ON cp.coupon_id = c.id
      WHERE cp.product_id = ?
      AND c.is_active = 1
      LIMIT 1
    `, [id]);

    let discount_price = Number(product.price);

    let coupon = null;

    if (couponRows.length > 0) {

      coupon = couponRows[0];

      if (coupon.type === "percent") {

        discount_price =
          Number(product.price) -
          (
            Number(product.price) *
            Number(coupon.value)
          ) / 100;

      }

      if (coupon.type === "flat") {

        discount_price =
          Number(product.price) -
          Number(coupon.value);

      }

    }

    return res.status(200).json({
      success: true,
      product: {

        ...product,

        image: product.image || null,

        images: product.images
          ? JSON.parse(product.images)
          : [],

        creator: {
          id: product.creator_id,
          name: product.creator_name,
          email: product.creator_email,
          mobile: product.creator_mobile
        },

        coupon,

        discount_price

      }
    });

  } catch (err) {
    next(err);
  }
};

// CREATE product
exports.createProduct = async (req, res, next) => {
  try {

    const {
      name,
      description,
      price,
      barcode,
      registration_id
    } = req.body;

    const image = req.files?.image?.[0]
      ? `${req.protocol}://${req.get("host")}/uploads/${req.files.image[0].filename}`
      : null;

    const images = req.files?.images?.length
      ? req.files.images.map(file =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        )
      : [];

    const [result] = await pool.query(
      `INSERT INTO products_table
      (
        name,
        description,
        price,
        barcode,
        image,
        images,
        registration_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        barcode,
        image,
        JSON.stringify(images),
        registration_id
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: {
        id: result.insertId,
        name,
        description,
        price,
        barcode,
        image,
        images,
        registration_id
      }
    });

  } catch (err) {
    next(err);
  }
};


// UPDATE product
exports.updateProduct = async (req, res, next) => {
  try {

    const {
      name,
      description,
      price,
      barcode,
      registration_id
    } = req.body;

    const productId = req.params.id;

    // Find product
    const [rows] = await pool.query(
      "SELECT * FROM products_table WHERE id=?",
      [productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const oldProduct = rows[0];

    let image = oldProduct.image;

    let images = JSON.parse(
      oldProduct.images || "[]"
    );

    /*
    ====================================
    SINGLE IMAGE UPDATE
    ====================================
    */

    if (req.files?.image?.length) {

      // Delete old image

      if (oldProduct.image) {

        const oldImageName =
          oldProduct.image.split("/").pop();

        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          oldImageName
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

      }

      image =
        `${req.protocol}://${req.get("host")}/uploads/${req.files.image[0].filename}`;

    }

    /*
    ====================================
    MULTIPLE IMAGE UPDATE
    ====================================
    */

    if (req.files?.images?.length) {

      // Delete old gallery images

      images.forEach(imageUrl => {

        const imageName =
          imageUrl.split("/").pop();

        const imagePath = path.join(
          __dirname,
          "../uploads",
          imageName
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

      });

      // New gallery images

      images = req.files.images.map(file =>
        `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );

    }

    /*
    ====================================
    UPDATE DATABASE
    ====================================
    */

    await pool.query(
      `UPDATE products_table
       SET
         name=?,
         description=?,
         price=?,
         barcode=?,
         image=?,
         images=?,
         registration_id=?
       WHERE id=?`,
      [
        name,
        description,
        price,
        barcode,
        image,
        JSON.stringify(images),
        registration_id,
        productId
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: {
        id: productId,
        name,
        description,
        price,
        barcode,
        image,
        images,
        registration_id
      }
    });

  } catch (err) {

    console.error(err);

    next(err);

  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {

  try {

    // get product
    const [rows] = await pool.query(
      "SELECT * FROM products_table WHERE id=?",
      [req.params.id]
    );

    // product not found
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = rows[0];

    // parse images
    const images = JSON.parse(
      product.images || "[]"
    );

    // delete images from folder
    images.forEach(image => {

      const imagePath = path.join(
        __dirname,
        "../uploads",
        image
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    });

    // delete product
    await pool.query(
      "DELETE FROM products_table WHERE id=?",
      [req.params.id]
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {

    next(err);

  }

};

exports.getProductByBarcode = async (req, res) => {

  const { barcode } = req.params;

  const [rows] = await pool.query(
    `SELECT * FROM products_table
     WHERE barcode = ?`,
    [barcode]
  );

  if (!rows.length) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  return res.json({
    success: true,
    product: rows[0]
  });

};