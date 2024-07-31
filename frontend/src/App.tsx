import Navbar from "./Navbar";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import Lobby from "./Lobby";
import Tictactoe from "./Tictactoe";


export default function App() {
  const { getToken } = useAuth();



  return (
    <>
      <header>
        <Navbar />
      </header>
      <section className="flex justify-center items-center h-96 flex-col">
        <Lobby />
        game here:
        <br></br>
        <Tictactoe />
      </section>
    </>
  )
}
