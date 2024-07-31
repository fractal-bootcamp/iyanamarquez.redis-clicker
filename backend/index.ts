import express from "express";
import cors from "cors";
import { Redis } from "ioredis";
import clerkAuthMiddleware from "./middleware";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import calculateWinner from "./game";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const uri = process.env.URI;
app.use(cors());

app.use(express.json());
const PORT = 3009;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("test", () => {
    console.log("test");
    io.emit("test2");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

if (!uri) {
  throw new Error("URI environment variable is not defined");
}
// const { port, hostname, username, password } = new URL(uri);

// const redis = new Redis({
//   port: Number(port),
//   host: hostname,
//   username,
//   password,
//   db: 0,
// });

app.get("/", async (req, res) => {
  console.log("Hello World");
  // await client.set("key", "value");
  // const value = await client.get("key");
  // await client.disconnect();
  console.log("ermhello");

  res.send("hello");
});

app.post(
  "/checkGame",
  ClerkExpressRequireAuth({}),
  clerkAuthMiddleware,
  async (req, res) => {
    const userEmail = req?.user?.emailAddresses[0].emailAddress;
    const winner = calculateWinner(req.body.squares);
    res.send(winner);
  }
);

app.post(
  "/",
  ClerkExpressRequireAuth({}),
  clerkAuthMiddleware,
  async (req, res) => {
    const userEmail = req?.user?.emailAddresses[0].emailAddress;
  }
);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.engine.on("connection_error", (err) => {
  console.error("Socket.IO connection error:", err);
});
