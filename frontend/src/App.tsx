import axios from "axios";
import Navbar from "./Navbar";

import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState("");

  const handleClick = () => {
    setCount(count + 1)
    axios.get("http://localhost:3009/")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <header>
        <Navbar />
      </header>
      <section className="flex justify-center items-center h-96 flex-col">
        <p className="text-2xl"> Count: {count}</p>

        <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2 rounded-md">Click Me</button>
      </section>
    </>
  )
}
