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

// async function rateLimiter(userId, limit) {
//   // Redis hash key
//   const clickLimit = 7;
//   const hashKey = `${userId}_data`;
//   const clicks = Number(await redis.get(hashKey));
//   if (clicks) {
//     redis.set(hashKey, clicks + 1, "EX", limit);
//     if (clicks > clickLimit) {
//       return false; // Not allowed
//     }
//     return true;
//   } else {
//     redis.set(hashKey, 1, "EX", limit);
//     return true; // Allowed
//   }
// }

async function rateLimiter(userEmail: string) {
  const currentLength = await redis.llen(`myqueue${userEmail}`);
  console.log("currentLength", currentLength);
  const additionalTime = currentLength;
  if (currentLength > 5) {
    console.log("Max click limit reached. Please try again later.");
    return false;
  } else {
    // add a click
    redis.rpush(`myqueue${userEmail}`, "clickdata");
    redis.expire(`myqueue${userEmail}`, 5 + additionalTime);
    console.log("Click added");
    return true;
  }
}

export default rateLimiter;
