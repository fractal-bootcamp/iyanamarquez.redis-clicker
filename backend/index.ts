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

type Lobby = {
  id: string;
  board: Array<string | null>;
  xIsNext: boolean;
  winState: string | null;
  users: string[];
};

type joinData = {
  room: string;
  socketId: string;
};

const lobbies: { [key: string]: Lobby } = {};

io.on("connection", (socket) => {
  socket.on("joinlobby", (joinData: joinData) => {
    console.log("curr lobbies:", lobbies);

    console.log("joindata is:", joinData);

    // Create new lobby
    const newLobby: Lobby = {
      id: joinData.room,
      board: Array(9).fill(null),
      xIsNext: true,
      winState: null,
      users: [],
    };
    if (!lobbies[joinData.room]) {
      console.log("creating new lobby");
      lobbies[joinData.room] = newLobby;
    }
    // Limit users array to a maximum of 2
    if (lobbies[joinData.room].users.length < 2) {
      // Check if the user is already in the lobby
      if (!lobbies[joinData.room].users.includes(socket.id)) {
        console.log("User joined lobby", joinData.room);
        lobbies[joinData.room].users.push(socket.id);
        socket.join(joinData.room); // Join the socket to the lobby room
        socket.emit("lobbyData", lobbies[joinData.room]); // Send current game data
        console.log(`${joinData.socketId} joined lobby: ${joinData.room}`);
      } else {
        socket.emit("error", "You are already in this lobby"); // Notify user if already in lobby
      }
    } else {
      socket.emit("error", "Lobby is full"); // Notify user if lobby is full
    }
  });

  // Tictactoe Game Logic
  socket.on("gamedata", (value) => {
    console.log("bruhmoment");

    // Find the lobby associated with the current socket ID
    const roomId = Object.keys(lobbies).find((room) => {
      return lobbies[room].users.includes(socket.id);
    });
    console.log("bruhmoment2");
    console.log("hello", roomId);
    if (roomId) {
      console.log("gamedata values456", value.squares);
      const boardData = [...value.squares];
      // Update the board data for the specific lobby
      lobbies[roomId].board = boardData;
      console.log("trackedVariable", lobbies[roomId]);
      socket.emit("gamedata", lobbies[roomId]);
    } else {
      socket.emit("error", "You are not authorized to update this lobby"); // Notify user if not authorized
    }
  });

  socket.on("lobbies", () => {
    console.log("lobbiessssssss", lobbies);
    socket.emit("lobbies", lobbies);
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
    // The user is authenticated at this point
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
    // The user is authenticated at this point
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
