# Quickstart: Snake Movement Control

**Feature**: 002-snake-control  
**Phase**: 1 - Design  
**Date**: 2026-03-14

## Prerequisites

- Node.js 20.x (managed via Nix)
- TypeScript 5.x
- Vitest and Playwright test frameworks
- Existing grid rendering module (001-grid-rendering)

## Implementation Order

### Step 1: Create Type Definitions

Create `src/snake/snake-types.ts` with core types:

```typescript
export type MovementDirection = 'up' | 'down' | 'left' | 'right';

export interface GridPosition {
  x: number;
  y: number;
}

export type SnakeBody = GridPosition[];

export interface SnakeState {
  body: SnakeBody;
  currentDirection: MovementDirection;
  pendingDirection: MovementDirection | null;
}
```

### Step 2: Create Constants

Create `src/snake/snake-constants.ts`:

```typescript
import type { MovementDirection, GridPosition } from './snake-types';

export const INITIAL_SNAKE_LENGTH = 3;

export const HEAD_COLOR = '#22c55e';
export const BODY_COLOR = '#16a34a';

export const DIRECTION_VECTORS: Record<MovementDirection, GridPosition> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS: Record<MovementDirection, MovementDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export const KEY_TO_DIRECTION: Record<string, MovementDirection> = {
  'h': 'left',
  'j': 'down',
  'k': 'up',
  'l': 'right',
};
```

### Step 3: Implement State Management

Create `src/snake/snake-state.ts`:

```typescript
import type { SnakeState, MovementDirection, GridPosition } from './snake-types';
import { DIRECTION_VECTORS, OPPOSITE_DIRECTIONS } from './snake-constants';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function createInitialSnakeState(): SnakeState {
  const centerX = Math.floor(TILE_COUNT_HORIZONTAL / 2);
  const centerY = Math.floor(TILE_COUNT_VERTICAL / 2);
  
  return {
    body: [
      { x: centerX, y: centerY },
      { x: centerX, y: centerY - 1 },
      { x: centerX, y: centerY - 2 },
    ],
    currentDirection: 'down',
    pendingDirection: null,
  };
}

export function calculateNextHeadPosition(
  currentHead: GridPosition,
  direction: MovementDirection
): GridPosition {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  };
}

export function isDirectionReversal(
  current: MovementDirection,
  proposed: MovementDirection
): boolean {
  return OPPOSITE_DIRECTIONS[current] === proposed;
}

export function queueDirectionChange(
  state: SnakeState,
  newDirection: MovementDirection
): SnakeState {
  if (isDirectionReversal(state.currentDirection, newDirection)) {
    return state;
  }
  
  return {
    ...state,
    pendingDirection: newDirection,
  };
}

export function applyPendingDirection(state: SnakeState): SnakeState {
  if (state.pendingDirection === null) {
    return state;
  }
  
  return {
    ...state,
    currentDirection: state.pendingDirection,
    pendingDirection: null,
  };
}

export function moveSnake(state: SnakeState): SnakeState {
  const newHead = calculateNextHeadPosition(state.body[0], state.currentDirection);
  const newBody = [newHead, ...state.body.slice(0, -1)];
  
  return {
    ...state,
    body: newBody,
  };
}
```

### Step 4: Implement Keyboard Input

Create `src/snake/keyboard-input.ts`:

```typescript
import type { SnakeState, MovementDirection } from './snake-types';
import { KEY_TO_DIRECTION } from './snake-constants';
import { queueDirectionChange } from './snake-state';

let snakeState: SnakeState | null = null;

export function initializeKeyboardInput(currentState: SnakeState): void {
  snakeState = currentState;
  document.addEventListener('keydown', handleKeyDown);
}

export function cleanupKeyboardInput(): void {
  document.removeEventListener('keydown', handleKeyDown);
  snakeState = null;
}

function handleKeyDown(event: KeyboardEvent): void {
  if (snakeState === null) return;
  
  const newDirection = KEY_TO_DIRECTION[event.key];
  if (newDirection === undefined) return;
  
  snakeState = queueDirectionChange(snakeState, newDirection);
}

export function getCurrentSnakeState(): SnakeState | null {
  return snakeState;
}

export function updateSnakeState(newState: SnakeState): void {
  snakeState = newState;
}
```

### Step 5: Implement Game Loop

Create `src/game/game-loop.ts`:

```typescript
import type { SnakeState } from '../snake/snake-types';
import { createInitialSnakeState, applyPendingDirection, moveSnake } from '../snake/snake-state';
import { initializeKeyboardInput, getCurrentSnakeState, updateSnakeState } from '../snake/keyboard-input';

const MOVEMENT_TICK_INTERVAL_IN_MILLISECONDS = 1000;

let gameLoopInterval: number | null = null;

export function initializeGameLoop(): void {
  const initialState = createInitialSnakeState();
  initializeKeyboardInput(initialState);
  
  gameLoopInterval = window.setInterval(executeMovementTick, MOVEMENT_TICK_INTERVAL_IN_MILLISECONDS);
}

export function cleanupGameLoop(): void {
  if (gameLoopInterval !== null) {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
  }
}

function executeMovementTick(): void {
  const currentState = getCurrentSnakeState();
  if (currentState === null) return;
  
  let newState = applyPendingDirection(currentState);
  newState = moveSnake(newState);
  
  updateSnakeState(newState);
}
```

### Step 6: Implement Rendering

Create `src/snake/snake-renderer.ts`:

```typescript
import type { SnakeBody, GridPosition } from './snake-types';
import { HEAD_COLOR, BODY_COLOR } from './snake-constants';
import type { calculateGridRenderMetrics } from '../grid/tile-calculation';

let renderingContext: CanvasRenderingContext2D | null = null;

export function initializeSnakeRenderer(context: CanvasRenderingContext2D): void {
  renderingContext = context;
}

export function renderSnake(
  body: SnakeBody,
  metrics: ReturnType<typeof calculateGridRenderMetrics>
): void {
  if (renderingContext === null) return;
  
  body.forEach((segment, index) => {
    renderSnakeSegment(segment, index === 0, metrics);
  });
}

function renderSnakeSegment(
  position: GridPosition,
  isHead: boolean,
  metrics: ReturnType<typeof calculateGridRenderMetrics>
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
```

### Step 7: Integration

Update `src/main.ts`:

```typescript
import { initializeGridRenderer, handleViewportResize } from './grid/grid-renderer';
import { initializeSnakeRenderer } from './snake/snake-renderer';
import { initializeGameLoop, cleanupGameLoop } from './game/game-loop';
import { calculateGridRenderMetrics, getViewportDimensions } from './grid/tile-calculation';

function initializeApplication(): void {
  const canvas = initializeGridRenderer();
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Unable to get rendering context');
  }
  
  initializeSnakeRenderer(context);
  initializeGameLoop();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApplication();
});

window.addEventListener('resize', () => {
  handleViewportResize();
});
```

## Testing

### Unit Tests (Vitest)

Run with: `npm run test:unit`

Key test files:
- `tests/unit/snake/snake-state.spec.ts` - State transitions, direction validation
- `tests/unit/snake/keyboard-input.spec.ts` - Key mapping, reversal prevention

### Acceptance Tests (Playwright)

Run with: `npm run test:acceptance`

Key test file:
- `tests/acceptance/snake-movement.spec.ts` - Full user workflows

## Verification

```bash
# Run all tests
npm test

# Run lint (if configured)
npm run lint
```

## Key Files Created

| File | Purpose |
|------|---------|
| `src/snake/snake-types.ts` | Core type definitions |
| `src/snake/snake-constants.ts` | Movement vectors, key mappings |
| `src/snake/snake-state.ts` | State management functions |
| `src/snake/keyboard-input.ts` | VIM key binding handlers |
| `src/snake/snake-renderer.ts` | Canvas rendering for snake |
| `src/game/game-loop.ts` | Tick-based movement system |
| `tests/unit/snake/*.spec.ts` | Unit tests |
| `tests/acceptance/snake-movement.spec.ts` | Acceptance tests |