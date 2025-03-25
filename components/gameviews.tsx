import {
  ObserveViewProps,
  PlayerViewProps,
} from "jsr:@brandonhorst/yourturn/types";
import type { CellValue, Move, ObserverState, PlayerState } from "../game/types.ts";

function TicTacToeBoard(
  props: {
    board: (CellValue)[][];
    pendingAction: boolean;
    perform?: (move: Move) => void;
  },
) {
  const boardSize = props.board.length;

  // Create a grid template style
  const gridStyle = {
    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
  };

  return (
    <div class="grid gap-1 w-full max-w-4xl mx-auto" style={gridStyle}>
      {props.board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <button
            type="button"
            key={`${rowIndex}-${colIndex}`}
            class={`aspect-square flex items-center justify-center border border-gray-300 text-xl font-bold ${
              cell === null && props.pendingAction
                ? "bg-gray-50 hover:bg-gray-100"
                : "bg-white"
            }`}
            disabled={cell !== null || !props.pendingAction}
            onClick={() => props.perform?.({ row: rowIndex, col: colIndex })}
            aria-label={`Position ${rowIndex}, ${colIndex}`}
          >
            {cell === "X" && <span class="text-blue-600">X</span>}
            {cell === "O" && <span class="text-red-600">O</span>}
            {cell === "Triangle" && (
              <span class="text-green-600">▲</span>
            )}
          </button>
        ))
      ))}
    </div>
  );
}

// Player info component
function PlayerInfo({ player, isActive }: {
  player: { name: string; symbol: CellValue; isVictor: boolean };
  isActive: boolean;
}) {
  const symbolColors = {
    "X": "text-blue-600",
    "O": "text-red-600",
    "Triangle": "text-green-600",
    "null": "",
  };

  const symbolDisplay = {
    "X": "X",
    "O": "O",
    "Triangle": "▲",
    "null": "",
  };

  return (
    <div
      class={`p-2 rounded ${
        player.isVictor ? "bg-green-100" : isActive ? "bg-yellow-50" : ""
      }`}
    >
      <div class="flex items-center gap-2">
        <span class={`font-bold text-xl ${symbolColors[player.symbol || "null"]}`}>
          {symbolDisplay[player.symbol || "null"]}
        </span>
        <span>{player.name}</span>
        {player.isVictor && <span class="text-green-600 font-bold">(Winner!)</span>}
        {isActive && !player.isVictor && <span class="text-yellow-600 font-bold">(Current Turn)</span>}
      </div>
    </div>
  );
}

export function PlayerView(
  { playerState, perform }: PlayerViewProps<Move, PlayerState>,
) {
  return (
    <div class="p-4">
      <div class="mb-4 text-center">
        <h2 class="text-2xl font-bold mb-4">3-Player Tic-Tac-Toe (9x9)</h2>
        <div class="flex flex-wrap justify-center gap-4 mb-4">
          {playerState.perPlayer.map((player, idx) => (
            <PlayerInfo
              key={idx}
              player={player}
              isActive={playerState.currentPlayer === idx}
            />
          ))}
        </div>

        {playerState.pendingAction && (
          <div class="mb-4 font-bold text-green-600">Your turn!</div>
        )}
        {!playerState.pendingAction &&
          !playerState.perPlayer.some((p) => p.isVictor) && (
          <div class="mb-4">Waiting for other players...</div>
        )}
      </div>

      <TicTacToeBoard
        board={playerState.board}
        pendingAction={playerState.pendingAction}
        perform={perform}
      />

      <div class="mt-4 text-center text-gray-600">
        Get 3 in a row anywhere on the board to win!
      </div>
    </div>
  );
}

export function ObserverView(
  { observerState }: ObserveViewProps<ObserverState>,
) {
  return (
    <div class="p-4">
      <div class="mb-4 text-center">
        <h2 class="text-2xl font-bold mb-4">3-Player Tic-Tac-Toe (9x9) - Observer View</h2>
        <div class="flex flex-wrap justify-center gap-4 mb-4">
          {observerState.perPlayer.map((player, idx) => (
            <PlayerInfo
              key={idx}
              player={player}
              isActive={observerState.currentPlayer === idx}
            />
          ))}
        </div>
      </div>

      <TicTacToeBoard
        board={observerState.board}
        pendingAction={false}
      />

      <div class="mt-4 text-center text-gray-600">
        Get 3 in a row anywhere on the board to win!
      </div>
    </div>
  );
}
