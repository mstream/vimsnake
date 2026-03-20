import type { GameState } from './game-types';
import { createInitialSnakeState } from '../snake/snake-state';
import { createInitialFoodState } from '../food/food-state';

export function createInitialGameState(): GameState {
  const snakeState = createInitialSnakeState();
  const foodState = createInitialFoodState(snakeState.body);
  
  return {
    snakeState,
    foodState,
    isSnakeGrowing: false,
    gameStatus: 'playing'
  };
}

export function restartGame(): GameState {
  return createInitialGameState();
}