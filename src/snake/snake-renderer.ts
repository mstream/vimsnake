import type { SnakeBody, GridPosition } from './snake-types';
import { HEAD_COLOR, BODY_COLOR } from './snake-constants';
import type { GridRenderMetrics } from '../grid/grid-constants';

let renderingContext: CanvasRenderingContext2D | null = null;

export function initializeSnakeRenderer(context: CanvasRenderingContext2D): void {
  renderingContext = context;
}

export function renderSnake(
  body: SnakeBody,
  metrics: GridRenderMetrics
): void {
  if (renderingContext === null) return;
  
  body.forEach((segment, index) => {
    renderSnakeSegment(segment, index === 0, metrics);
  });
}

function renderSnakeSegment(
  position: GridPosition,
  isHead: boolean,
  metrics: GridRenderMetrics
): void {
  if (renderingContext === null) return;
  
  const pixelX = metrics.offsetX + position.x * metrics.tileSizeInPixels;
  const pixelY = metrics.offsetY + position.y * metrics.tileSizeInPixels;
  
  renderingContext.fillStyle = isHead ? HEAD_COLOR : BODY_COLOR;
  renderingContext.fillRect(
    pixelX,
    pixelY,
    metrics.tileSizeInPixels,
    metrics.tileSizeInPixels
  );
}

export function cleanupSnakeRenderer(): void {
  renderingContext = null;
}