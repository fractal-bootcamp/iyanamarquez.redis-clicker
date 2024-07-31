import { useEffect, useState } from "react";
import socket, { isSocketConnected } from './socket'; // Import the socket instance and connection check

const Tictactoe = () => {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [board, setBoard] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [currPlayer, setCurrPlayer] = useState("X");
    const [gameData, setGameData] = useState(null);
    console.log('gameData', gameData)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        const nextSquares = squares.slice();
        if (nextSquares[index]) return;
        nextSquares[index] = currPlayer;
        setSquares(nextSquares);
        setBoard(nextSquares);

        // Emit only if socket is connected
        if (isSocketConnected()) {
            socket.emit('gamedata', { squares: nextSquares });
        }
    }


    useEffect(() => {
        // Listen for game data only if socket is connected
        if (isSocketConnected()) {
            socket.on("gamedata", (data) => {
                setGameData(data);
                setBoard(data.board);

            });
        }


        // Cleanup listener on unmount
        return () => {
            socket.off("gamedata");
        };
    }, [squares]);

    const resetGame = () => {
        setSquares(Array(9).fill(null))
        setBoard(Array(9).fill(null));
        setWinner(null);
        setCurrPlayer("X");
    }
    return (
        <div>
            <h1>Tictactoe</h1>
            <h1 className="text-center text-white text-2xl mb-4">Room is {gameData?.id}</h1>
            <h1 className="text-center text-white text-2xl mb-4">Winner is {winner}</h1>
            <div className="grid grid-cols-3">
                {board.map((square, index) => (
                    <button key={index} className="border border-white w-20 h-20 text-white text-6xl" onClick={(e) => handleClick(e, index)}>
                        {square}
                    </button>

                ))}
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={resetGame}>Reset Game</button>
        </div>
    )
}

export default Tictactoe;