import Valkey from "ioredis";
import { configDotenv } from "dotenv";

configDotenv();
const serviceUrl = process.env.REDIS_URL;

if (!serviceUrl) {
  throw new Error("REDIS_URL is not defined");
}

const redisClient = new Valkey(serviceUrl);

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redisClient;
