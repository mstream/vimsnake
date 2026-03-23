import type { GameState } from './game-types';
import { createInitialGameState, restartGame } from './game-state';
import { initializeKeyboardInput, getCurrentSnakeState, updateSnakeState, cleanupKeyboardInput } from '../snake/keyboard-input';
import { applyPendingDirection, moveSnake } from '../snake/snake-state';
import { renderSnake, cleanupSnakeRenderer } from '../snake/snake-renderer';
import { renderFood, initializeFoodRenderer, cleanupFoodRenderer, getFoodRenderingContext } from '../food/food-renderer';
import { hasFoodAtPosition, consumeFood } from '../food/food-state';
import { detectCollision } from '../collision/collision-detector';
import { renderGameOverOverlay } from '../collision/game-over-overlay';
import type { GridRenderMetrics } from '../grid/grid-constants';
import { renderGridBackground, renderGridLines } from '../grid/grid-renderer';

const MOVEMENT_TICK_INTERVAL_IN_MILLISECONDS = 1000;
const RESTART_DELAY_IN_MILLISECONDS = 1500;

let gameLoopInterval: number | null = null;
let currentMetrics: GridRenderMetrics | null = null;
let gameState: GameState | null = null;

export function initializeGameLoop(metrics: GridRenderMetrics): GameState {
  currentMetrics = metrics;
  gameState = createInitialGameState();
  
  initializeKeyboardInput(gameState.snakeState);
  initializeFoodRenderer(getContext());
  
  (window as any).gameState = gameState;
  
  renderGridBackground(currentMetrics);
  renderGridLines(currentMetrics);
  renderSnake(gameState.snakeState.body, currentMetrics);
  
  if (gameState.foodState.position !== null && currentMetrics !== null) {
    const context = getFoodRenderingContext();
    if (context !== null) {
      renderFood(context, gameState.foodState, currentMetrics);
    }
  }
  
  gameLoopInterval = window.setInterval(executeMovementTick, MOVEMENT_TICK_INTERVAL_IN_MILLISECONDS);
  
  return gameState;
}

function getContext(): CanvasRenderingContext2D {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Unable to get rendering context');
  }
  return context;
}

export function cleanupGameLoop(): void {
  if (gameLoopInterval !== null) {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
  }
  cleanupKeyboardInput();
  cleanupSnakeRenderer();
  cleanupFoodRenderer();
  currentMetrics = null;
  gameState = null;
  
  if (typeof window !== 'undefined') {
    (window as any).gameState = null;
  }
}

function executeMovementTick(): void {
  if (gameState === null || currentMetrics === null) return;
  
  if (gameState.gameStatus === 'game-over') return;
  
  const currentSnakeState = getCurrentSnakeState();
  if (currentSnakeState === null) return;
  
  const newState = applyPendingDirection(currentSnakeState);
  const movedState = moveSnake(newState, gameState.isSnakeGrowing);
  
  if (gameState.isSnakeGrowing) {
    gameState = {
      ...gameState,
      snakeState: movedState,
      isSnakeGrowing: false
    };
  } else {
    gameState = {
      ...gameState,
      snakeState: movedState
    };
  }
  
  const collisionResult = detectCollision(gameState.snakeState.body);
  if (collisionResult.hasCollision) {
    gameState = {
      ...gameState,
      gameStatus: 'game-over'
    };
    updateSnakeState(gameState.snakeState);
    (window as any).gameState = gameState;
    
    renderGridBackground(currentMetrics);
    renderGridLines(currentMetrics);
    renderSnake(gameState.snakeState.body, currentMetrics);
    
    if (gameState.foodState.position !== null) {
      const context = getFoodRenderingContext();
      if (context !== null) {
        renderFood(context, gameState.foodState, currentMetrics);
      }
    }
    
    const overlayContext = getContext();
    renderGameOverOverlay(overlayContext, currentMetrics.totalGridWidth, currentMetrics.totalGridHeight);
    
    setTimeout(handleGameOver, RESTART_DELAY_IN_MILLISECONDS);
    return;
  }
  
  if (gameState.foodState.position !== null) {
    const snakeHead = gameState.snakeState.body[0];
    if (hasFoodAtPosition(gameState.foodState, snakeHead)) {
      gameState = {
        ...gameState,
        foodState: consumeFood(gameState.foodState, gameState.snakeState.body),
        isSnakeGrowing: true
      };
    }
  }
  
  updateSnakeState(gameState.snakeState);
  (window as any).gameState = gameState;
  
  renderGridBackground(currentMetrics);
  renderGridLines(currentMetrics);
  renderSnake(gameState.snakeState.body, currentMetrics);
  
  if (gameState.foodState.position !== null) {
    const context = getFoodRenderingContext();
    if (context !== null) {
      renderFood(context, gameState.foodState, currentMetrics);
    }
  }
}

function clearFullCanvas(): void {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (canvas === null) return;
  const context = canvas.getContext('2d');
  if (context === null) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function handleGameOver(): void {
  gameState = restartGame();
  initializeKeyboardInput(gameState.snakeState);
  updateSnakeState(gameState.snakeState);
  (window as any).gameState = gameState;

  if (currentMetrics !== null) {
    clearFullCanvas();
    renderGridBackground(currentMetrics);
    renderGridLines(currentMetrics);
    renderSnake(gameState.snakeState.body, currentMetrics);

    if (gameState.foodState.position !== null) {
      const context = getFoodRenderingContext();
      if (context !== null) {
        renderFood(context, gameState.foodState, currentMetrics);
      }
    }
  }
}

export function updateGameLoopMetrics(metrics: GridRenderMetrics): void {
  currentMetrics = metrics;
  
  if (gameState !== null && currentMetrics !== null) {
    renderGridBackground(currentMetrics);
    renderGridLines(currentMetrics);
    renderSnake(gameState.snakeState.body, currentMetrics);
    
    if (gameState.foodState.position !== null) {
      const context = getFoodRenderingContext();
      if (context !== null) {
        renderFood(context, gameState.foodState, currentMetrics);
      }
    }
  }
}

export function getGameState(): GameState | null {
  return gameState;
}

export function updateGameState(newState: GameState): void {
  gameState = newState;
  (window as any).gameState = gameState;
}