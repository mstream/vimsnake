import type { GridBounds, CollisionResult } from './collision-types';
import type { GridPosition, SnakeBody } from '../snake/snake-types';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function getGridBounds(): GridBounds {
  return {
    minimumX: 0,
    maximumX: TILE_COUNT_HORIZONTAL - 1,
    minimumY: 0,
    maximumY: TILE_COUNT_VERTICAL - 1
  };
}

export function isPositionWithinBounds(
  position: GridPosition,
  bounds: GridBounds
): boolean {
  const isXValid = position.x >= bounds.minimumX && position.x <= bounds.maximumX;
  const isYValid = position.y >= bounds.minimumY && position.y <= bounds.maximumY;
  return isXValid && isYValid;
}

export function hasBoundaryCollision(
  head: GridPosition,
  bounds: GridBounds
): boolean {
  return !isPositionWithinBounds(head, bounds);
}

export function hasSelfCollision(
  head: GridPosition,
  body: SnakeBody
): boolean {
  for (let index = 1; index < body.length; index++) {
    const segment = body[index];
    if (segment.x === head.x && segment.y === head.y) {
      return true;
    }
  }
  return false;
}

export function detectCollision(snakeBody: SnakeBody): CollisionResult {
  const head = snakeBody[0];
  const bounds = getGridBounds();
  
  if (hasBoundaryCollision(head, bounds)) {
    return {
      hasCollision: true,
      collisionType: 'boundary'
    };
  }
  
  if (hasSelfCollision(head, snakeBody)) {
    return {
      hasCollision: true,
      collisionType: 'self'
    };
  }
  
  return {
    hasCollision: false,
    collisionType: null
  };
}