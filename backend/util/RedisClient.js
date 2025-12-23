import Valkey from "ioredis";
const serviceUrl  = process.env.REDIS_URL;
const redisClient = new Valkey(serviceUrl);

export default redisClient;
