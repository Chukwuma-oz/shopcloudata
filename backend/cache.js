const { createClient } = require("redis");

let client;

async function connectRedis() {
  if (!process.env.REDIS_HOST) return null;

  client = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT || 6379)
    }
  });

  client.on("error", (err) => console.error("Redis error:", err.message));

  await client.connect();
  return client;
}

function getRedis() {
  return client;
}

module.exports = { connectRedis, getRedis };
