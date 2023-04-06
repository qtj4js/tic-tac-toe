import { useState } from "react";

function Square({ value, onSquareClick }) {
  const { content = "" } = value || {};
  return (
      <button className="square" onClick={onSquareClick}>
        {content}
      </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    // 记住每一步的步号 + 点击的索引
    const stepIndex = squares.filter((v) => v != null).length;
    nextSquares[i] = { stepIndex, index: i, content: xIsNext ? "X" : "O" };
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.content;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
      <>
        <div className="status">{status}</div>
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </>
  );
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

    if (move > 0) {
      // 根据步号排序, 找到当前的最后一步
      // 然后根据索引算出 row & col
      const [lastSquare] = squares
          .filter((v) => v != null)
          .sort((a, b) => {
            return b.stepIndex - a.stepIndex;
          });
      console.log(lastSquare);
      const { index } = lastSquare;
      const row = (index / 3) >> 0;
      const col = index % 3;
      console.log(row, col);
      description = `Go to move #${move}: (${row + 1}, ${col + 1})`;
    } else {
      description = "Go to game start";
    }
    return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
    );
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
        squares[a] &&
        squares[a].content === squares[b]?.content &&
        squares[a].content === squares[c]?.content
    ) {
      return squares[a];
    }
  }
  return null;
}
