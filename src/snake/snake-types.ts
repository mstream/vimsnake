export type MovementDirection = 'up' | 'down' | 'left' | 'right';

export interface GridPosition {
  x: number;
  y: number;
}

export type SnakeBody = GridPosition[];

export interface SnakeState {
  body: SnakeBody;
  currentDirection: MovementDirection;
  pendingDirection: MovementDirection | null;
}