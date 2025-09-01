const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

async function getCache(key) {
  await connectRedis();
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value, ttlSeconds = 3600) {
  await connectRedis();
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttlSeconds,
  });
}

module.exports = {
  getCache,
  setCache,
};
