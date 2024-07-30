import express from "express";
import cors from "cors";
import { Redis } from "ioredis";
import clerkAuthMiddleware from "./middleware";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import rateLimiter from "./redis";

const app = express();

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

app.use(cors());

app.use(express.json());
const PORT = 3009;

app.use(express.json());

app.get("/", async (req, res) => {
  console.log("Hello World");
  // await client.set("key", "value");
  // const value = await client.get("key");
  // await client.disconnect();
  console.log("ermhello");

  res.send("hello");
});

app.post(
  "/checkLimit",
  ClerkExpressRequireAuth({}),
  clerkAuthMiddleware,
  async (req, res) => {
    const userEmail = req.user.emailAddresses[0].emailAddress;

    async function currentClicks(userId) {
      return await redis.get(`${userId}_data`);
    }
    if (!(await currentClicks(userEmail))) {
      console.log("user allowed to click");
      res.send(true);
    }

    res.send(await currentClicks(userEmail));
  }
);

app.post(
  "/",
  ClerkExpressRequireAuth({}),
  clerkAuthMiddleware,
  async (req, res) => {
    console.log("Hello post World");
    const userEmail = req.user.emailAddresses[0].emailAddress;
    const allowed = await rateLimiter(userEmail, 10);
    res.send(allowed);
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
