import type { FoodState } from './food-types';
import type { GridRenderMetrics } from '../grid/grid-constants';
import { FOOD_COLOR } from './food-constants';

export function renderFood(
  context: CanvasRenderingContext2D,
  foodState: FoodState,
  metrics: GridRenderMetrics
): void {
  if (foodState.position === null) return;
  
  const x = foodState.position.x * metrics.tileSizeInPixels + metrics.offsetX;
  const y = foodState.position.y * metrics.tileSizeInPixels + metrics.offsetY;
  const size = metrics.tileSizeInPixels;
  
  context.fillStyle = FOOD_COLOR;
  context.fillRect(x, y, size, size);
}

let foodRenderingContext: CanvasRenderingContext2D | null = null;

export function initializeFoodRenderer(context: CanvasRenderingContext2D): void {
  foodRenderingContext = context;
}

export function cleanupFoodRenderer(): void {
  foodRenderingContext = null;
}

export function getFoodRenderingContext(): CanvasRenderingContext2D | null {
  return foodRenderingContext;
}