import type { FoodState } from './food-types';
import type { SnakeBody } from '../snake/snake-types';
import type { GridPosition } from '../snake/snake-types';
import { spawnFoodAtRandomPosition } from './food-spawner';
import { hasValidFoodPositions } from './food-spawner';

export function createInitialFoodState(snakeBody: SnakeBody): FoodState {
  if (!hasValidFoodPositions(snakeBody)) {
    return { position: null };
  }
  
  const position = spawnFoodAtRandomPosition(snakeBody);
  return { position };
}

export function hasFoodAtPosition(
  foodState: FoodState,
  position: GridPosition
): boolean {
  if (foodState.position === null) return false;
  
  return foodState.position.x === position.x && foodState.position.y === position.y;
}

export function consumeFood(
  _foodState: FoodState,
  snakeBody: SnakeBody
): FoodState {
  if (!hasValidFoodPositions(snakeBody)) {
    return { position: null };
  }
  
  const position = spawnFoodAtRandomPosition(snakeBody);
  return { position };
}