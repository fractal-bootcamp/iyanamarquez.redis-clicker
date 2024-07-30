import axios from "axios";
import Navbar from "./Navbar";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";


export default function App() {
  const { getToken } = useAuth();

  const [count, setCount] = useState(0);
  const [data, setData] = useState(true);



  const handleClick = () => {
    setCount(count + 1);

    (async () => {
      fetch(`http://localhost:3009/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getToken()}`
        },
      }).then(res => res.json()).then((data) => {
        console.log('data', data);
        // if
        setData(data)
      }).catch((error) => {
        console.log(error)
      });
    })();
  }
  useEffect(() => {
    handleClick();
    const interval = setInterval(handleClick, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [data]);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <section className="flex justify-center items-center h-96 flex-col">
        <p className="text-2xl"> Count: {count}</p>


        <button disabled={!data} onClick={handleClick} className="bg-blue-300 text-black px-4 py-2 rounded-md mt-10">Click Me</button>
      </section>
    </>
  )
}
