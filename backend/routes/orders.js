const express = require("express");
const { createPool } = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer?.name || !customer?.email || !customer?.address || !items?.length) {
    return res.status(400).json({
      message: "Name, email, address and at least one item are required."
    });
  }

  const db = createPool();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (customer_name, customer_email, address, total, status)
       VALUES (?, ?, ?, ?, 'Received')`,
      [customer.name, customer.email, customer.address, Number(total || 0)]
    );

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderResult.insertId, item.id, item.quantity, item.price]
      );

      await connection.query(
        `UPDATE products
         SET stock = GREATEST(stock - ?, 0)
         WHERE id = ?`,
        [item.quantity, item.id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Order received successfully.",
      order: {
        id: orderResult.insertId,
        total: Number(total || 0),
        status: "Received"
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Unable to create order" });
  } finally {
    connection.release();
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await createPool().query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to retrieve orders" });
  }
});

module.exports = router;
