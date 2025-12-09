const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => {
  // Registro de errores de redis
  console.error('Redis error', err.message);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = { redisClient, connectRedis };
