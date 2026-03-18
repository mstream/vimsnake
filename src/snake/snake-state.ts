import type { SnakeState, MovementDirection, GridPosition } from './snake-types';
import { DIRECTION_VECTORS, OPPOSITE_DIRECTIONS } from './snake-constants';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function createInitialSnakeState(): SnakeState {
  const centerX = Math.floor(TILE_COUNT_HORIZONTAL / 2);
  const centerY = Math.floor(TILE_COUNT_VERTICAL / 2);
  
  return {
    body: [
      { x: centerX, y: centerY },
      { x: centerX, y: centerY - 1 },
      { x: centerX, y: centerY - 2 },
    ],
    currentDirection: 'down',
    pendingDirection: null,
  };
}

export function calculateNextHeadPosition(
  currentHead: GridPosition,
  direction: MovementDirection
): GridPosition {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  };
}

export function isDirectionReversal(
  current: MovementDirection,
  proposed: MovementDirection
): boolean {
  return OPPOSITE_DIRECTIONS[current] === proposed;
}

export function queueDirectionChange(
  state: SnakeState,
  newDirection: MovementDirection
): SnakeState {
  const directionToCheck = state.pendingDirection ?? state.currentDirection;
  if (isDirectionReversal(directionToCheck, newDirection)) {
    return state;
  }
  
  return {
    ...state,
    pendingDirection: newDirection,
  };
}

export function applyPendingDirection(state: SnakeState): SnakeState {
  if (state.pendingDirection === null) {
    return state;
  }
  
  return {
    ...state,
    currentDirection: state.pendingDirection,
    pendingDirection: null,
  };
}

export function moveSnake(state: SnakeState, isGrowing: boolean = false): SnakeState {
  const newHead = calculateNextHeadPosition(state.body[0], state.currentDirection);
  const newBody = isGrowing 
    ? [newHead, ...state.body]
    : [newHead, ...state.body.slice(0, -1)];
  
  return {
    ...state,
    body: newBody,
  };
}