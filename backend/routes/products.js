const express = require("express");
const { createPool } = require("../db");
const { getRedis } = require("../cache");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim().toLowerCase();
    const category = String(req.query.category || "").trim();

    const cache = getRedis();
    const cacheKey = `products:${search}:${category}`;

    if (cache) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    const db = createPool();
    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category.toLowerCase() !== "all") {
      sql += " AND category = ?";
      params.push(category);
    }

    sql += " ORDER BY id";

    const [rows] = await db.query(sql, params);

    if (cache) {
      await cache.setEx(
        cacheKey,
        Number(process.env.REDIS_TTL_SECONDS || 60),
        JSON.stringify(rows)
      );
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to retrieve products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cache = getRedis();
    const cacheKey = `product:${req.params.id}`;

    if (cache) {
      const cached = await cache.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    const [rows] = await createPool().query(
      "SELECT * FROM products WHERE id = ?",
      [Number(req.params.id)]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (cache) {
      await cache.setEx(cacheKey, 60, JSON.stringify(rows[0]));
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to retrieve product" });
  }
});

module.exports = router;
