import { ComponentChildren } from "preact";
import { LobbyViewProps } from "jsr:@brandonhorst/yourturn/types";

export function Button(
  props: {
    onClick?: () => void;
    children: ComponentChildren;
  },
) {
  return (
    <button
      type="button"
      class="flex-grow bg-blue-200 hover:bg-blue-300 active:bg-blue-400 focus:ring-4 focus:ring-blue-300  rounded px-5 py-2.5 focus:outline-none"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function LobbyView(
  { activeGames, joinQueue, isQueued, leaveQueue }: LobbyViewProps,
) {
  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold pt-4">3-Player Tic-Tac-Toe (9x9)</h1>
      <p class="mt-2 mb-4 text-gray-600">
        Play a 3-player version of Tic-Tac-Toe on a 9x9 grid. Be the first to get 3 symbols in a row (horizontal, vertical, or diagonal) to win!
      </p>

      <h2 class="text-lg font-semibold pt-4 mb-2">Start a New Game</h2>
      {isQueued
        ? <Button onClick={leaveQueue}>Leave Queue</Button>
        : <Button onClick={() => joinQueue("standard")}>Join Game Queue</Button>}

      <h2 class="text-lg font-semibold pt-6 mb-2">Active Games</h2>
      {activeGames.length === 0
        ? <div class="italic text-gray-600">No active games at the moment</div>
        : (
          <ul class="list-disc list-inside">
            {activeGames.map(({ gameId }) => (
              <li class="mb-1">
                <a
                  class="cursor-pointer text-blue-600 hover:text-blue-800 underline"
                  href={`/observe/${gameId}`}
                >
                  Game {gameId}
                </a>
              </li>
            ))}
          </ul>
        )}

      <div class="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
        <h3 class="font-semibold mb-2">How to Play</h3>
        <ul class="list-disc list-inside text-gray-700">
          <li>Three players take turns placing their symbols (X, O, or ▲) on the board</li>
          <li>Be the first to get 3 of your symbols in a row (horizontally, vertically, or diagonally)</li>
          <li>The game ends when a player wins or the board is full (draw)</li>
        </ul>
      </div>
    </div>
  );
}
