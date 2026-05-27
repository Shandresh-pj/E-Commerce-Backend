const pool = require("../db");

// GET all products
exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products_table");
    res.json(rows);
  } catch (err) { next(err); }
};

// GET product by ID
exports.getProductById = async (req, res, next) => {

  try {

    const { id } = req.params;

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

    // convert JSON string to array
    product.images = JSON.parse(
      product.images || "[]"
    );

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
