import { Redis } from "ioredis";

// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.

const uri =
  "redis://default:xs5BQB53SSRKF2z3LN3C1qOxWO39xmJp@redis-16518.c100.us-east-1-4.ec2.cloud.redislabs.com:16518";

const { port, hostname, username, password } = new URL(uri);
const redis = new Redis({
  port: Number(port),
  host: hostname,
  username,
  password,
  db: 0,
});

redis.set("mykey", "bruh"); // Returns a promise which resolves to "OK" when the command succeeds.
redis.set("user1", "clicked something");
// ioredis supports the node.js callback style
redis.get("mykey", (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Prints "value"
  }
});

async function rateLimiter(
  userId: string,
  limit: number,
  windowInSeconds: number
) {
  const key = `rateLimiter:${userId}`;
  const current = await redis.incr(key);

  if (current === 1) {
    // Set expiration time for the key if it's the first click
    await redis.expire(key, windowInSeconds);
  }

  if (current > limit) {
    return false; // Rate limit exceeded
  }

  return true; // Allowed
}
export default rateLimiter;
