import type { FoodPosition } from './food-types';
import type { SnakeBody } from '../snake/snake-types';
import { getInvalidPositionsForFood } from './food-adjacency';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function isValidFoodPosition(
  position: FoodPosition,
  snakeBody: SnakeBody
): boolean {
  const invalidPositions = getInvalidPositionsForFood(snakeBody);
  const positionKey = `${position.x},${position.y}`;
  
  if (position.x < 0 || position.x >= TILE_COUNT_HORIZONTAL) return false;
  if (position.y < 0 || position.y >= TILE_COUNT_VERTICAL) return false;
  
  return !invalidPositions.has(positionKey);
}

export function findValidFoodPositions(snakeBody: SnakeBody): FoodPosition[] {
  const invalidPositions = getInvalidPositionsForFood(snakeBody);
  const validPositions: FoodPosition[] = [];
  
  for (let x = 0; x < TILE_COUNT_HORIZONTAL; x++) {
    for (let y = 0; y < TILE_COUNT_VERTICAL; y++) {
      const positionKey = `${x},${y}`;
      if (!invalidPositions.has(positionKey)) {
        validPositions.push({ x, y });
      }
    }
  }
  
  return validPositions;
}

export function hasValidFoodPositions(snakeBody: SnakeBody): boolean {
  const validPositions = findValidFoodPositions(snakeBody);
  return validPositions.length > 0;
}

export function spawnFoodAtRandomPosition(snakeBody: SnakeBody): FoodPosition {
  const validPositions = findValidFoodPositions(snakeBody);
  
  if (validPositions.length === 0) {
    throw new Error('No valid positions available for food placement');
  }
  
  const randomIndex = Math.floor(Math.random() * validPositions.length);
  return validPositions[randomIndex];
}