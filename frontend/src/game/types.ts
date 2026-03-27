export type Direction = 'up' | 'down' | 'left' | 'right';
export type GamePhase = 'idle' | 'playing' | 'paused' | 'gameOver';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  gridSize: number;
}

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 5;
export const POINTS_PER_FOOD = 10;
