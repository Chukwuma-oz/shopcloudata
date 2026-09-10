const { createClient } = require("redis");

let client = null;

async function connectRedis() {
  if (!process.env.REDIS_HOST) return null;

  try {
    client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT || 6379),
        tls: true,
        connectTimeout: 5000,
        reconnectStrategy: false
      }
    });

    client.on("error", (err) => {
      console.error("Redis error:", err.message);
    });

    await client.connect();
    console.log("Redis connected");
    return client;
  } catch (err) {
    console.error("Redis unavailable:", err.message);
    client = null;
    return null;
  }
}

function getRedis() {
  return client;
}

module.exports = { connectRedis, getRedis };