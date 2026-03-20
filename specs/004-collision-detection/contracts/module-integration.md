# Module Integration Contracts: Collision Detection

**Feature**: 004-collision-detection  
**Date**: 2026-03-19  
**Type**: Internal Module Interfaces

## Overview

This document defines the integration contracts between the new `collision` module and existing game modules. Since this is a browser-based game with no external APIs, contracts focus on internal module interfaces and state update patterns.

---

## Contract: Collision Module Public Interface

### Module: `src/collision/`

The collision module exports the following public interface for use by other modules.

#### Types

```typescript
// collision/collision-types.ts

export type GameStatus = 'playing' | 'game-over';

export type CollisionType = 'boundary' | 'self';

export interface GridBounds {
  minimumX: number;
  maximumX: number;
  minimumY: number;
  maximumY: number;
}

export interface CollisionResult {
  hasCollision: boolean;
  collisionType: CollisionType | null;
}
```

#### Boundary Detection Functions

```typescript
// collision/collision-detector.ts

export function getGridBounds(): GridBounds;

export function isPositionWithinBounds(
  position: GridPosition,
  bounds: GridBounds
): boolean;

export function hasBoundaryCollision(
  head: GridPosition,
  bounds: GridBounds
): boolean;
```

#### Self-Collision Detection Functions

```typescript
// collision/collision-detector.ts

export function hasSelfCollision(
  head: GridPosition,
  body: SnakeBody
): boolean;

export function detectCollision(
  snakeState: SnakeState
): CollisionResult;
```

#### Overlay Rendering Functions

```typescript
// collision/game-over-overlay.ts

export function renderGameOverOverlay(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void;
```

**Contract Invariant**:
- `detectCollision` MUST check boundary collision BEFORE self collision
- `detectCollision` MUST return first collision found (boundary takes precedence)
- `hasSelfCollision` MUST skip the head segment when checking body
- `renderGameOverOverlay` MUST use semi-transparent overlay (alpha < 1.0)
- `renderGameOverOverlay` MUST display "You crashed" text

---

## Contract: Game State Integration

### Extension to GameState

The GameState type must be extended to include game status:

```typescript
// game/game-types.ts (extended)

export interface GameState {
  snakeState: SnakeState;
  foodState: FoodState;
  isSnakeGrowing: boolean;
  gameStatus: GameStatus;
}
```

**Contract Requirements**:
1. `gameStatus` MUST be initialized to `'playing'` at game start
2. `gameStatus` MUST transition to `'game-over'` immediately after collision detection
3. `gameStatus` MUST transition back to `'playing'` after automatic restart
4. No other transitions are valid for `gameStatus`

---

## Contract: Game Loop Integration

### Update Cycle with Collision Detection

The game loop must integrate collision detection in the update phase:

**Update Contract**:

```typescript
// game/game-loop.ts

export function updateGameState(currentState: GameState): GameState {
  // 0. Check game status - if 'game-over', ignore tick
  if (currentState.gameStatus === 'game-over') {
    return currentState;
  }
  
  // 1. Apply pending direction
  // 2. Move snake (calculate new head position)
  const newHeadPosition = calculateNextHeadPosition(
    currentState.snakeState.body[0],
    currentState.snakeState.currentDirection
  );
  
  // 3. Check collision
  const collisionResult = detectCollision({
    ...currentState.snakeState,
    body: [newHeadPosition, ...currentState.snakeState.body.slice(0, -1)]
  });
  
  if (collisionResult.hasCollision) {
    // a. Set gameStatus to 'game-over'
    // b. Schedule automatic restart after 1.5 seconds
    return {
      ...currentState,
      gameStatus: 'game-over'
    };
  }
  
  // 4. Check food (if no collision)
  if (hasFoodAtPosition(currentState.foodState, newHeadPosition)) {
    // a. Set isSnakeGrowing = true
    // b. Remove/consume food
    // c. Spawn new food
  }
  
  // 5. Move snake (with growth consideration)
  // 6. Reset isSnakeGrowing if needed
}
```

**Collision Priority Contract**:
- Collision detection MUST happen BEFORE food check
- Collision MUST take precedence over food consumption
- If collision detected, food consumption MUST NOT occur

**Render Contract**:

```typescript
// grid/grid-renderer.ts (extended)

export function renderGameState(
  context: CanvasRenderingContext2D,
  gameState: GameState,
  metrics: GridRenderMetrics
): void {
  // Must render in order:
  // 1. Grid background
  // 2. Food (if position is not null)
  // 3. Snake body
  // 4. Game-over overlay (if gameStatus is 'game-over')
  
  if (gameState.gameStatus === 'game-over') {
    renderGameOverOverlay(
      context,
      metrics.canvasWidth,
      metrics.canvasHeight
    );
  }
}
```

---

## Contract: Restart Mechanism

### Automatic Restart Timing

When collision is detected, the game must restart automatically:

**Restart Contract**:

```typescript
// game/game-loop.ts

function handleGameOver(gameState: GameState): void {
  // Schedule restart after 1.5 seconds (middle of 1-2 second requirement)
  setTimeout(() => {
    restartGame();
  }, 1500);
}

function restartGame(): void {
  // Reset all state:
  // 1. Reset snake to initial position (center, length 3, moving down)
  // 2. Reset direction to 'down'
  // 3. Spawn new food at valid position
  // 4. Set gameStatus to 'playing'
  // 5. Clear isSnakeGrowing flag
}
```

**Contract Guarantees**:
- Restart MUST reset snake to exact initial state: center position, length 3, moving down
- Restart MUST spawn new food at valid position (not on/adjacent to snake)
- Restart MUST set `gameStatus` to `'playing'`
- All game state MUST be reset to match initial game start

---

## Contract: Boundary Detection

### Grid Bounds Calculation

The collision module must provide grid bounds:

```typescript
// collision/collision-detector.ts

export function getGridBounds(): GridBounds {
  return {
    minimumX: 0,
    maximumX: TILE_COUNT_HORIZONTAL - 1,
    minimumY: 0,
    maximumY: TILE_COUNT_VERTICAL - 1
  };
}
```

**Contract Guarantees**:
- Bounds are inclusive (minimum and maximum values are valid)
- Bounds match existing grid constants
- Bounds use 0-indexed coordinates

---

## Contract: Self-Collision Detection

### Body Traversal for Collision

The self-collision check must traverse the snake body:

```typescript
// collision/collision-detector.ts

export function hasSelfCollision(
  head: GridPosition,
  body: SnakeBody
): boolean {
  // Skip head segment (index 0)
  // Check each remaining segment
  for (let index = 1; index < body.length; index++) {
    if (body[index].x === head.x && body[index].y === head.y) {
      return true;
    }
  }
  return false;
}
```

**Contract Requirements**:
- MUST skip the head segment when checking (can't collide with itself)
- MUST check all body segments (indices1 to length-1)
- MUST return true if any segment position matches head position
- MUST return false if snake length is less than 4 (impossible to have self-collision)

---

## Contract: Overlay Rendering

### Semi-Transparent Overlay

The overlay must be rendered with specific appearance:

```typescript
// collision/game-over-overlay.ts

const OVERLAY_ALPHA = 0.7; // Semi-transparent (70% opacity)
const OVERLAY_TEXT = 'You crashed';
const OVERLAY_COLOR = '#000000'; // Black background

export function renderGameOverOverlay(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Save context state
  context.save();
  
  // Set semi-transparent alpha
  context.globalAlpha = OVERLAY_ALPHA;
  
  // Draw full-screen rectangle
  context.fillStyle = OVERLAY_COLOR;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Restore context state
  context.restore();
  
  // Draw text (full opacity)
  context.fillStyle = '#ffffff'; // White text
  context.font = 'bold 48px sans-serif'; // Large, bold text
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(OVERLAY_TEXT, canvasWidth / 2, canvasHeight / 2);
}
```

**Contract Guarantees**:
- Overlay MUST cover entire canvas (full width and height)
- Overlay MUST be semi-transparent (alpha between 0.5 and 0.9)
- Overlay MUST allow seeing final snake position underneath
- Text MUST display "You crashed" (exact text from spec)
- Text MUST be centered on canvas
- Text MUST be readable (contrasting color, large size)

---

## Contract: Test Integration

### Acceptance Test Requirements

All acceptance tests must verify:

1. **Boundary collision**: Snake crashes at all four grid boundaries
2. **Self-collision**: Snake crashes into its own body
3. **Overlay display**: Semi-transparent overlay with "You crashed" appears
4. **Automatic restart**: Game restarts after 1-2 seconds
5. **State reset**: Game returns to initial state after restart

**Test Contract**:

```typescript
// tests/acceptance/collision-detection.spec.ts

test('snake crashes when hitting grid boundary', () => {
  // Must verify:
  // - Game ends when snake head moves outside grid bounds
  // - Overlay appears
  // - Game restarts after 1.5 seconds
});

test('snake crashes when hitting its own body', () => {
  // Must verify:
  // - Game ends when snake head overlaps with body segment
  // - Overlay appears
  // - Game restarts after 1.5 seconds
});

test('overlay displays "You crashed" message', () => {
  // Must verify:
  // - Semi-transparent overlay covers game
  // - Text "You crashed" is visible
  // - Final snake position visible underneath
});

test('game automatically restarts after collision', () => {
  // Must verify:
  // - Restart happens within 1-2 seconds
  // - All state reset to initial values
  // - Snake at center, length 3, moving down
  // - New food at valid position
});
```

---

## Summary

### Contract Checklist

Before integration, verify:

- [ ] `GameStatus` enum has 'playing' and 'game-over' values
- [ ] `GameState` includes `gameStatus` field
- [ ] `getGridBounds` returns correct boundary values
- [ ] `isPositionWithinBounds` validates position against bounds
- [ ] `hasBoundaryCollision` correctly detects out-of-bounds positions
- [ ] `hasSelfCollision` skips head segment when checking body
- [ ] `detectCollision` checks boundary before self collision
- [ ] `renderGameOverOverlay` uses semi-transparent overlay
- [ ] Overlay displays "You crashed" text exactly
- [ ] Game loop ignores ticks when `gameStatus === 'game-over'`
- [ ] Collision check happens before food check
- [ ] Automatic restart scheduled for 1.5 seconds
- [ ] Restart resets all state to initial values
- [ ] All acceptance tests pass on Chrome, Firefox, Edge, Safari