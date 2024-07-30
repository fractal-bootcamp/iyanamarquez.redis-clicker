import express from "express";
import cors from "cors";
import { createClient } from "redis";
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
  await client.set("key", "value");
  const value = await client.get("key");
  await client.disconnect();

  res.send(value);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
