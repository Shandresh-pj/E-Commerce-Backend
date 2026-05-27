const pool = require("../db");

// GET all products
exports.getProducts = async (req, res, next) => {

  try {

    // get products
    const [products] = await pool.query(
      "SELECT * FROM products_table"
    );

    // get coupons mapping
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

    // attach coupon to products
    const updatedProducts = products.map(product => {

      const coupon = couponRows.find(
        c => c.product_id === product.id
      );

      let discount_price = product.price;

      if (coupon) {

        // percent discount
        if (coupon.type === "percent") {

          discount_price =
            product.price -
            (product.price * coupon.value) / 100;

        }

        // flat discount
        if (coupon.type === "flat") {

          discount_price =
            product.price - coupon.value;

        }

      }

      return {

        ...product,

        images: JSON.parse(
          product.images || "[]"
        ),

        coupon: coupon || null,

        discount_price

      };

    });

    return res.status(200).json({
      success: true,
      products: updatedProducts
    });

  } catch (err) {

    next(err);

  }

};

// GET product by ID
exports.getProductById = async (req, res, next) => {

  try {

    const { id } = req.params;

    // ================= PRODUCT =================
    const [rows] = await pool.query(
      "SELECT * FROM products_table WHERE id=?",
      [id]
    );

    // product not found
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = rows[0];

    // convert images JSON string to array
    product.images = JSON.parse(
      product.images || "[]"
    );

    // ================= COUPON =================
    const [couponRows] = await pool.query(
      `
      SELECT
        c.id,
        c.code,
        c.type,
        c.value
      FROM coupon_products cp
      JOIN coupons c
      ON cp.coupon_id = c.id
      WHERE cp.product_id=? 
      AND c.is_active=1
      LIMIT 1
      `,
      [id]
    );

    // default price
    let discount_price = Number(product.price);

    // apply coupon if exists
    if (couponRows.length > 0) {

      const coupon = couponRows[0];

      // percent discount
      if (coupon.type === "percent") {

        discount_price =
          Number(product.price) -
          (
            Number(product.price) *
            Number(coupon.value)
          ) / 100;

      }

      // flat discount
      if (coupon.type === "flat") {

        discount_price =
          Number(product.price) -
          Number(coupon.value);

      }

      // prevent negative amount
      if (discount_price < 0) {
        discount_price = 0;
      }

      // attach coupon details
      product.coupon = coupon;

    } else {

      product.coupon = null;

    }

    // final discount price
    product.discount_price = discount_price;

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      product
    });

  } catch (err) {

    next(err);

  }

};

// CREATE product
exports.createProduct = async (req, res, next) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { name, description, price } = req.body;

    // SINGLE IMAGE
    const image =
      req.files?.image?.[0]?.filename || null;

    // MULTIPLE IMAGES
    const images =
      req.files?.images
        ? req.files.images.map(file => file.filename)
        : [];

    const [result] = await pool.query(
      `INSERT INTO products_table (name, description, price, image, images)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        image,
        JSON.stringify(images)
      ]
    );

    return res.status(201).json({
      success: true,
      product: {
        id: result.insertId,
        name,
        description,
        price,
        image,
        images
      }
    });

  } catch (err) {
    console.log(err);
    next(err);
  }
};


// UPDATE product
exports.updateProduct = async (req, res, next) => {

  try {

    const {
      name,
      description,
      price
    } = req.body;

    // get old product
    const [rows] = await pool.query(
      "SELECT * FROM products_table WHERE id=?",
      [req.params.id]
    );

    // not found
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const oldProduct = rows[0];

    // old images
    const oldImages = JSON.parse(
      oldProduct.images || "[]"
    );

    // delete old images from uploads folder
    oldImages.forEach(image => {

      const imagePath = path.join(
        __dirname,
        "../uploads",
        image
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    });

    // new uploaded images
    const images = req.files.map(
      file => file.filename
    );

    // update product
    await pool.query(
      `UPDATE products_table
      SET name=?, description=?, price=?, images=?
      WHERE id=?`,
      [
        name,
        description,
        price,
        JSON.stringify(images),
        req.params.id
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: {
        id: req.params.id,
        name,
        description,
        price,
        images
      }
    });

  } catch (err) {

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
