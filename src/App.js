import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const chunkSize = 3;
  const slicedSquareList = [];

  for (let i = 0; i < squares.length; i += chunkSize) {
    slicedSquareList.push(squares.slice(i, i + chunkSize));
  }

  const squareElements = slicedSquareList.map((slicedSquares, rowIndex) => {
    return (
      <div className="board-row" key={rowIndex}>
        {slicedSquares.map((square, colIndex) => {
          const index = rowIndex * chunkSize + colIndex;
          console.log(index);

          return (
            <Square
              key={index}
              value={square}
              onSquareClick={() => handleClick(index)}
            />
          );
        })}
      </div>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      {squareElements}
    </>
  );
}

function calculateWinner(squares) {
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

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let element;

    if (move === currentMove && move != 0) {
      description = "You are at move #…";
      element = <p>{description}</p>;
    } else if (move > 0) {
      description = "Go to move #" + move;
      element = <button onClick={() => jumpTo(move)}>{description}</button>;
    } else {
      description = "Go to game start";
      element = <button onClick={() => jumpTo(move)}>{description}</button>;
    }
    return <li key={move}>{element}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
