const db = require("../db");

exports.createOrder = async (req, res, next) => {

  try {

    const { user_id, items } = req.body;

    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "user_id and items are required"
      });
    }

    // calculate total
    let totalAmount = 0;

    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // insert order
    const [orderResult] = await db.query(
      "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
      [user_id, totalAmount]
    );

    const orderId = orderResult.insertId;

    // insert order items
    for (let item of items) {

      await db.query(
        `INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price
        ]
      );

    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order_id: orderId,
      total: totalAmount
    });

  } catch (err) {

    next(err);

  }

};

exports.getOrders = async (req, res, next) => {

  try {

    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY id DESC"
    );

    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (err) {

    next(err);

  }

};

 exports.getOrderById = async (req, res, next) => {

  try {

    const { id } = req.params;

    const [order] = await db.query(
      "SELECT * FROM orders WHERE id=?",
      [id]
    );

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const [items] = await db.query(
      "SELECT * FROM order_items WHERE order_id=?",
      [id]
    );

    return res.status(200).json({
      success: true,
      order: order[0],
      items
    });

  } catch (err) {

    next(err);

  }

};

exports.deleteOrder = async (req, res, next) => {

  try {

    const { id } = req.params;

    await db.query("DELETE FROM order_items WHERE order_id=?", [id]);

    const [result] = await db.query(
      "DELETE FROM orders WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (err) {

    next(err);

  }

};