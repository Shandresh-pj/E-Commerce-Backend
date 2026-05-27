const db = require("../db");

exports.createOrder = async (req, res, next) => {

  try {

    const { user_id, items, coupon_code } = req.body;

    let subtotal = 0;
    let discount = 0;
    let finalTotal = 0;

    // calculate subtotal first
    items.forEach(i => {
      subtotal += i.price * i.quantity;
    });

    // default
    finalTotal = subtotal;

    // check coupon
    if (coupon_code) {

      const [couponRows] = await db.query(
        "SELECT * FROM coupons WHERE code=? AND is_active=1",
        [coupon_code]
      );

      if (couponRows.length > 0) {

        const coupon = couponRows[0];

        // get allowed products for coupon
        const [allowedProducts] = await db.query(
          "SELECT product_id FROM coupon_products WHERE coupon_id=?",
          [coupon.id]
        );

        const allowedIds = allowedProducts.map(p => p.product_id);

        // apply discount ONLY on matching products
        let discountableAmount = 0;

        for (let item of items) {

          if (allowedIds.includes(item.product_id)) {
            discountableAmount += item.price * item.quantity;
          }

        }

        // calculate discount
        if (coupon.type === "percent") {
          discount = (discountableAmount * coupon.value) / 100;
        }

        if (coupon.type === "flat") {
          discount = coupon.value;
        }

        finalTotal = subtotal - discount;

      }

    }

    return res.status(200).json({
      success: true,
      subtotal,
      discount,
      total: finalTotal
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