import type { GridPosition, SnakeBody } from '../snake/snake-types';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function getPositionsAdjacentTo(position: GridPosition): GridPosition[] {
  const adjacentPositions: GridPosition[] = [];
  
  for (let deltaX = -1; deltaX <= 1; deltaX++) {
    for (let deltaY = -1; deltaY <= 1; deltaY++) {
      if (deltaX === 0 && deltaY === 0) continue;
      
      const adjacentPosition = {
        x: position.x + deltaX,
        y: position.y + deltaY
      };
      
      if (adjacentPosition.x >= 0 && adjacentPosition.x < TILE_COUNT_HORIZONTAL &&
          adjacentPosition.y >= 0 && adjacentPosition.y < TILE_COUNT_VERTICAL) {
        adjacentPositions.push(adjacentPosition);
      }
    }
  }
  
  return adjacentPositions;
}

export function isPositionAdjacentToSnakeBody(
  position: GridPosition,
  snakeBody: SnakeBody
): boolean {
  for (const segment of snakeBody) {
    const adjacentPositions = getPositionsAdjacentTo(segment);
    for (const adjacentPosition of adjacentPositions) {
      if (adjacentPosition.x === position.x && adjacentPosition.y === position.y) {
        return true;
      }
    }
  }
  return false;
}

export function getInvalidPositionsForFood(snakeBody: SnakeBody): Set<string> {
  const invalidPositions = new Set<string>();
  
  for (const segment of snakeBody) {
    invalidPositions.add(`${segment.x},${segment.y}`);
    
    const adjacentPositions = getPositionsAdjacentTo(segment);
    for (const adjacentPosition of adjacentPositions) {
      invalidPositions.add(`${adjacentPosition.x},${adjacentPosition.y}`);
    }
  }
  
  return invalidPositions;
}