export type CellValue = "X" | "O" | "Triangle" | null;
export type Board = CellValue[][];

export type Config = {
  gridSize: number;
  winLength: number;
};

export type Position = {
  row: number;
  col: number;
};

export type GameState = {
  board: Board;
  currentPlayer: number;
  lastMoveTimestamp: number;
};

type PerPlayerClientState = {
  name: string;
  symbol: CellValue;
  isVictor: boolean;
};

export type PlayerState = {
  playerId: number;
  pendingAction: boolean;
  perPlayer: PerPlayerClientState[];
  board: Board;
  currentPlayer: number;
};

export type ObserverState = {
  perPlayer: PerPlayerClientState[];
  board: Board;
  currentPlayer: number;
};

export type Move = Position;
