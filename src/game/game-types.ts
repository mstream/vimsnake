import type { SnakeState } from '../snake/snake-types';
import type { FoodState } from '../food/food-types';

export interface GameState {
  snakeState: SnakeState;
  foodState: FoodState;
  isSnakeGrowing: boolean;
}