import { useEffect, useState } from "react";

const ExampleGame = () => {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [currPlayer, setCurrPlayer] = useState("X");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        if (winner) return;
        const nextSquares = squares.slice();
        if (nextSquares[index]) return;
        nextSquares[index] = currPlayer;
        setSquares(nextSquares);
        setCurrPlayer(currPlayer === "X" ? "O" : "X");
        // fetch call to server to save the move
    }
    const calculateWinner = (squares: any) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    useEffect(() => {
        const winner = calculateWinner(squares);
        if (winner) {
            setWinner(winner);
        }
    }, [squares]);

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setWinner(null);
        setCurrPlayer("X");
    }

    console.log(squares)
    return (
        <div>
            <h1>Tictactoe</h1>
            <h1 className="text-center text-white text-2xl mb-4">Winner is {winner}</h1>
            <div className="grid grid-cols-3">
                {squares.map((square, index) => (
                    <button key={index} className="border border-white w-20 h-20 text-white text-6xl" onClick={(e) => handleClick(e, index)}>
                        {square}
                    </button>

                ))}
            </div>
        </div>
    )
}

export default ExampleGame;