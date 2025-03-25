import { Game } from "jsr:@brandonhorst/yourturn/types";
import type {
  Board,
  CellValue,
  Config,
  GameState,
  Move,
  ObserverState,
  PlayerState,
} from "./types.ts";
import { produce } from "npm:immer";

export const game: Game<Config, GameState, Move, PlayerState, ObserverState> = {
  modes: {
    standard: {
      numPlayers: 3,
      matchmaking: "queue",
      config: { gridSize: 9, winLength: 3 },
    },
  },

  setup({ config, timestamp }): Readonly<GameState> {
    // Create an empty 9x9 board
    const board: Board = Array(config.gridSize)
      .fill(null)
      .map(() => Array(config.gridSize).fill(null));

    return {
      board,
      currentPlayer: 0, // Player 0 starts
      lastMoveTimestamp: timestamp.valueOf(),
    };
  },

  isValidMove(s, { move, playerId }): boolean {
    // Check if it's this player's turn
    if (playerId !== s.currentPlayer) {
      return false;
    }

    // Check if the position is valid (within the board)
    if (
      move.row < 0 ||
      move.row >= s.board.length ||
      move.col < 0 ||
      move.col >= s.board[0].length
    ) {
      return false;
    }

    // Check if the position is empty
    return s.board[move.row][move.col] === null;
  },

  processMove(s, { move, playerId, timestamp }): Readonly<GameState> {
    return produce(s, (s) => {
      // Place the symbol on the board based on player id
      const symbols: CellValue[] = ["X", "O", "Triangle"];
      s.board[move.row][move.col] = symbols[playerId];

      // Switch to the next player
      s.currentPlayer = (playerId + 1) % 3;
      s.lastMoveTimestamp = timestamp.valueOf();
    });
  },

  playerState(
    s,
    { playerId, players, isComplete, config },
  ): Readonly<PlayerState> {
    const winner = findWinner(s.board, config);
    const symbols: CellValue[] = ["X", "O", "Triangle"];

    return {
      playerId,
      pendingAction: playerId === s.currentPlayer && !isComplete,
      perPlayer: players.map((player, idx) => ({
        name: player.name,
        symbol: symbols[idx],
        isVictor: winner === idx,
      })),
      board: s.board,
      currentPlayer: s.currentPlayer,
    };
  },

  observerState(
    s,
    { players, config },
  ): Readonly<ObserverState> {
    const winner = findWinner(s.board, config);
    const symbols: CellValue[] = ["X", "O", "Triangle"];

    return {
      perPlayer: players.map((player, idx) => ({
        name: player.name,
        symbol: symbols[idx],
        isVictor: winner === idx,
      })),
      board: s.board,
      currentPlayer: s.currentPlayer,
    };
  },

  isComplete(s, { config }): boolean {
    // Game is complete if there's a winner or the board is full
    return findWinner(s.board, config) !== null || isBoardFull(s.board);
  },
};

// Check if the board is full (a draw)
function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

// Find winner by checking if any player has the required number of symbols in a row
function findWinner(board: Board, config: Config): number | null {
  const winLength = config.winLength;
  const symbols: CellValue[] = ["X", "O", "Triangle"];

  const directions = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal down-right
    { dr: 1, dc: -1 }, // diagonal down-left
  ];

  const checkLine = (
    row: number,
    col: number,
    dr: number,
    dc: number,
    symbol: CellValue,
  ): boolean => {
    if (symbol === null) return false;

    // Check for winLength consecutive symbols
    for (let i = 0; i < winLength; i++) {
      const r = row + i * dr;
      const c = col + i * dc;

      // Out of bounds or different symbol
      if (
        r < 0 ||
        r >= board.length ||
        c < 0 ||
        c >= board[0].length ||
        board[r][c] !== symbol
      ) {
        return false;
      }
    }
    return true;
  };

  // Check all possible starting positions for a winning line
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const symbol = board[row][col];
      if (symbol === null) continue;

      for (const { dr, dc } of directions) {
        if (checkLine(row, col, dr, dc, symbol)) {
          return symbols.indexOf(symbol);
        }
      }
    }
  }

  return null; // No winner found
}
