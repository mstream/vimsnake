import type { MovementDirection, GridPosition } from './snake-types';

export const INITIAL_SNAKE_LENGTH = 3;

export const HEAD_COLOR = '#22c55e';
export const BODY_COLOR = '#16a34a';

export const DIRECTION_VECTORS: Record<MovementDirection, GridPosition> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS: Record<MovementDirection, MovementDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export const KEY_TO_DIRECTION: Record<string, MovementDirection> = {
  'h': 'left',
  'j': 'down',
  'k': 'up',
  'l': 'right',
};