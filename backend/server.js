const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db");
const { connectRedis } = require("./cache");

const products = require("./routes/products");
const orders = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  res.json({
    status: "ok",
    service: "shopcloud-api",
    database: "mysql",
    cache: process.env.REDIS_HOST ? "redis" : "disabled",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/products", products);
app.use("/api/orders", orders);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function start() {
  try {
    await initializeDatabase();
    console.log("MySQL database initialized");

    try {
      await connectRedis();
      console.log("Redis cache connected");
    } catch (error) {
      console.error("Redis unavailable; continuing without cache:", error.message);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`ShopCloud API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

start();
