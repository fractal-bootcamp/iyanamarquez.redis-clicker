import { io } from "socket.io-client";

const socket = io("http://localhost:3009");

// Optional: Check if the socket is connected
export const isSocketConnected = () => {
  return socket.connected;
};

export default socket;
