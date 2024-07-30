import express from "express";
import cors from "cors";
import { createClient } from "redis";
import clerkAuthMiddleware from "./middleware";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import rateLimiter from "./redis";

const app = express();

const client = createClient({
  password: "xs5BQB53SSRKF2z3LN3C1qOxWO39xmJp",
  socket: {
    host: "redis-16518.c100.us-east-1-4.ec2.cloud.redislabs.com",
    port: 16518,
  },
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
  "/",
  ClerkExpressRequireAuth({}),
  clerkAuthMiddleware,
  async (req, res) => {
    console.log("Hello post World");
    const userEmail = req.user.emailAddresses[0].emailAddress;

    rateLimiter(userEmail, 3, 10).then((allowed) => {
      res.send(allowed);
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
