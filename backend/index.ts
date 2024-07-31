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

const gameData = [
  {
    lobby1: {
      board: Array(9).fill(null),
      xIsNext: true,
      winState: null,
      player1: null,
      player2: null,
    },
  },
  {
    lobby2: {
      board: Array(9).fill(null),
      xIsNext: true,
      winState: null,
      player1: null,
      player2: null,
    },
  },
];

io.on("connection", (socket) => {
  console.log("New client connected");

  // Tictactoe Game Logic
  socket.on("gamedata", (value) => {
    const boardData = value;
    // put gamedata into lobby1
    gameData[0].lobby1.board = boardData;
    console.log("trackedVariable", gameData);
    socket.emit("gamedata", gameData[0].lobby1);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
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
    const data = req.body;
    io.emit("test", data);
    console.log(data);
  }
);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.engine.on("connection_error", (err) => {
  console.error("Socket.IO connection error:", err);
});
