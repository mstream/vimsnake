import type { SnakeState } from '../snake/snake-types';
import { createInitialSnakeState, applyPendingDirection, moveSnake } from '../snake/snake-state';
import { initializeKeyboardInput, getCurrentSnakeState, updateSnakeState, cleanupKeyboardInput } from '../snake/keyboard-input';
import { renderSnake, cleanupSnakeRenderer } from '../snake/snake-renderer';
import type { GridRenderMetrics } from '../grid/grid-constants';
import { renderGridBackground, renderGridLines } from '../grid/grid-renderer';

const MOVEMENT_TICK_INTERVAL_IN_MILLISECONDS = 1000;

let gameLoopInterval: number | null = null;
let currentMetrics: GridRenderMetrics | null = null;

export function initializeGameLoop(metrics: GridRenderMetrics): SnakeState {
  currentMetrics = metrics;
  const initialState = createInitialSnakeState();
  initializeKeyboardInput(initialState);
  
  renderGridBackground(currentMetrics);
  renderGridLines(currentMetrics);
  renderSnake(initialState.body, currentMetrics);
  
  gameLoopInterval = window.setInterval(executeMovementTick, MOVEMENT_TICK_INTERVAL_IN_MILLISECONDS);
  
  return initialState;
}

export function cleanupGameLoop(): void {
  if (gameLoopInterval !== null) {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
  }
  cleanupKeyboardInput();
  cleanupSnakeRenderer();
  currentMetrics = null;
}

function executeMovementTick(): void {
  const currentState = getCurrentSnakeState();
  if (currentState === null || currentMetrics === null) return;
  
  const newState = applyPendingDirection(currentState);
  const movedState = moveSnake(newState);
  
  updateSnakeState(movedState);
  
  renderGridBackground(currentMetrics);
  renderGridLines(currentMetrics);
  renderSnake(movedState.body, currentMetrics);
}

export function updateGameLoopMetrics(metrics: GridRenderMetrics): void {
  currentMetrics = metrics;
  
  const currentState = getCurrentSnakeState();
  if (currentState !== null && currentMetrics !== null) {
    renderGridBackground(currentMetrics);
    renderGridLines(currentMetrics);
    renderSnake(currentState.body, currentMetrics);
  }
}