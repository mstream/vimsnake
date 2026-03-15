import { initializeGridRenderer, handleViewportResize } from './grid/grid-renderer';
import { initializeSnakeRenderer } from './snake/snake-renderer';
import { initializeGameLoop, updateGameLoopMetrics } from './game/game-loop';
import { calculateGridRenderMetrics, getViewportDimensions } from './grid/tile-calculation';

function initializeApplication(): void {
  const canvas = initializeGridRenderer();
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Unable to get rendering context');
  }
  
  initializeSnakeRenderer(context);
  
  const viewportDimensions = getViewportDimensions();
  const gridMetrics = calculateGridRenderMetrics(viewportDimensions);
  
  initializeGameLoop(gridMetrics);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApplication();
});

window.addEventListener('resize', () => {
  handleViewportResize();
  
  const viewportDimensions = getViewportDimensions();
  const gridMetrics = calculateGridRenderMetrics(viewportDimensions);
  updateGameLoopMetrics(gridMetrics);
});