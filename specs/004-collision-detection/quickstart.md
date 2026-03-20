# Quick Start: Collision Detection Implementation

**Feature**: 004-collision-detection  
**Time Estimate**: 5-7 hours  
**Prerequisites**: Grid rendering (001), Snake control (002), Food spawning (003)

## Implementation Steps

### 1. Create Collision Module Structure

Create the `src/collision/` directory with three files:

```bash
mkdir -p src/collision
touch src/collision/collision-types.ts
touch src/collision/collision-detector.ts
touch src/collision/game-over-overlay.ts
```

### 2. Define Collision Types

**File**: `src/collision/collision-types.ts`

```typescript
import type { GridPosition } from '../snake/snake-types';

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

### 3. Implement Grid Bounds

**File**: `src/collision/collision-detector.ts`

```typescript
import type { GridBounds, CollisionResult, CollisionType } from './collision-types';
import type { GridPosition, SnakeBody, SnakeState } from '../snake/snake-types';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function getGridBounds(): GridBounds {
  return {
    minimumX: 0,
    maximumX: TILE_COUNT_HORIZONTAL - 1,
    minimumY: 0,
    maximumY: TILE_COUNT_VERTICAL - 1
  };
}

export function isPositionWithinBounds(
  position: GridPosition,
  bounds: GridBounds
): boolean {
  const isXValid = position.x >= bounds.minimumX && position.x <= bounds.maximumX;
  const isYValid = position.y >= bounds.minimumY && position.y <= bounds.maximumY;
  return isXValid && isYValid;
}

export function hasBoundaryCollision(
  head: GridPosition,
  bounds: GridBounds
): boolean {
  return !isPositionWithinBounds(head,bounds);
}
```

### 4. Implement Self-Collision Detection

**File**: `src/collision/collision-detector.ts` (continued)

```typescript
export function hasSelfCollision(
  head: GridPosition,
  body: SnakeBody
): boolean {
  for (let index = 1; index < body.length; index++) {
    const segment = body[index];
    if (segment.x === head.x && segment.y === head.y) {
      return true;
    }
  }
  return false;
}

export function detectCollision(snakeState: SnakeState): CollisionResult {
  const head = snakeState.body[0];
  const bounds = getGridBounds();
  
  if (hasBoundaryCollision(head, bounds)) {
    return {
      hasCollision: true,
      collisionType: 'boundary'
    };
  }
  
  if (hasSelfCollision(head, snakeState.body)) {
    return {
      hasCollision: true,
      collisionType: 'self'
    };
  }
  
  return {
    hasCollision: false,
    collisionType: null
  };
}
```

### 5. Implement Game-Over Overlay

**File**: `src/collision/game-over-overlay.ts`

```typescript
const OVERLAY_ALPHA = 0.7;
const OVERLAY_COLOR = '#000000';
const OVERLAY_TEXT = 'You crashed';
const TEXT_COLOR = '#ffffff';
const TEXT_FONT = 'bold 48px sans-serif';

export function renderGameOverOverlay(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  context.save();
  
  context.globalAlpha = OVERLAY_ALPHA;
  context.fillStyle = OVERLAY_COLOR;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  context.restore();
  
  context.fillStyle = TEXT_COLOR;
  context.font = TEXT_FONT;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(OVERLAY_TEXT, canvasWidth / 2, canvasHeight / 2);
}
```

### 6. Extend Game State Types

**File**: Create or extend `src/game/game-types.ts`

```typescript
import type { SnakeState } from '../snake/snake-types';
import type { FoodState } from '../food/food-types';
import type { GameStatus } from '../collision/collision-types';

export interface GameState {
  snakeState: SnakeState;
  foodState: FoodState;
  isSnakeGrowing: boolean;
  gameStatus: GameStatus;
}
```

### 7. Extend Game State Creation

**File**: Modify `src/game/game-state.ts`

```typescript
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
```

### 8. Integrate Collision in Game Loop

**File**: Modify `src/game/game-loop.ts`

```typescript
import type { GameState } from './game-types';
import { detectCollision } from '../collision/collision-detector';
import { hasFoodAtPosition } from '../food/food-state';
import { spawnFoodAtRandomPosition } from '../food/food-spawner';

const RESTART_DELAY_IN_MILLISECONDS = 1500;

export function updateGameState(currentState: GameState): GameState {
  if (currentState.gameStatus === 'game-over') {
    return currentState;
  }
  
  const directionToApply = currentState.snakeState.pendingDirection ?? 
                            currentState.snakeState.currentDirection;
  
  const newHeadPosition = calculateNextHeadPosition(
    currentState.snakeState.body[0],
    directionToApply
  );
  
  const newBody = currentState.isSnakeGrowing
    ? [newHeadPosition, ...currentState.snakeState.body]
    : [newHeadPosition, ...currentState.snakeState.body.slice(0, -1)];
  
  const tentativeSnakeState = {
    ...currentState.snakeState,
    body: newBody,
    currentDirection: directionToApply,
    pendingDirection: null
  };
  
  const collisionResult = detectCollision(tentativeSnakeState);
  
  if (collisionResult.hasCollision) {
    handleGameOver();
    return {
      ...currentState,
      snakeState: tentativeSnakeState,
      gameStatus: 'game-over'
    };
  }
  
  let newFoodState = currentState.foodState;
  let isSnakeGrowing = false;
  
  if (hasFoodAtPosition(currentState.foodState, newHeadPosition)) {
    const newFoodPosition = spawnFoodAtRandomPosition(newBody);
    newFoodState = { position: newFoodPosition };
    isSnakeGrowing = true;
  }
  
  return {
    snakeState: tentativeSnakeState,
    foodState: newFoodState,
    isSnakeGrowing,
    gameStatus: 'playing'
  };
}

function handleGameOver(): void {
  setTimeout(() => {
    const newGameState = createInitialGameState();
    updateGlobalGameState(newGameState);
    gameLoop();
  }, RESTART_DELAY_IN_MILLISECONDS);
}
```

### 9. Update Rendering

**File**: Modify `src/grid/grid-renderer.ts` or equivalent

```typescript
import { renderGameOverOverlay } from '../collision/game-over-overlay';

export function renderGameState(
  context: CanvasRenderingContext2D,
  gameState: GameState,
  metrics: GridRenderMetrics
): void {
  clearCanvas(context, metrics.canvasWidth, metrics.canvasHeight);
  renderGrid(context, metrics);
  
  if (gameState.foodState.position) {
    renderFood(context, gameState.foodState, metrics);
  }
  
  renderSnake(context, gameState.snakeState, metrics);
  
  if (gameState.gameStatus === 'game-over') {
    renderGameOverOverlay(context, metrics.canvasWidth, metrics.canvasHeight);
  }
}
```

### 10. Write Unit Tests

**File**: `tests/unit/collision/collision-detector.spec.ts`

```typescript
import { describe, test, expect } from 'vitest';
import { getGridBounds, isPositionWithinBounds, hasBoundaryCollision, hasSelfCollision, detectCollision } from '../src/collision/collision-detector';
import type { SnakeState } from '../src/snake/snake-types';

describe('collision detector', () => {
  describe('getGridBounds', () => {
    test('returns correct grid bounds for32x32 grid', () => {
      const bounds = getGridBounds();
      expect(bounds.minimumX).toBe(0);
      expect(bounds.maximumX).toBe(31);
      expect(bounds.minimumY).toBe(0);
      expect(bounds.maximumY).toBe(31);
    });
  });
  
  describe('isPositionWithinBounds', () => {
    test('returns true for position inside grid', () => {
      const bounds = getGridBounds();
      const position = { x: 10, y: 15 };
      expect(isPositionWithinBounds(position, bounds)).toBe(true);
    });
    
    test('returns true for position at edge', () => {
      const bounds = getGridBounds();
      const position = { x: 31, y: 31 };
      expect(isPositionWithinBounds(position, bounds)).toBe(true);
    });
    
    test('returns false for position outside grid', () => {
      const bounds = getGridBounds();
      const position = { x: 32, y: 15 };
      expect(isPositionWithinBounds(position, bounds)).toBe(false);
    });
  });
  
  describe('hasBoundaryCollision', () => {
    test('detects collision at right boundary', () => {
      const bounds = getGridBounds();
      const head = { x: 32, y: 15 };
      expect(hasBoundaryCollision(head, bounds)).toBe(true);
    });
    
    test('detects collision attop boundary', () => {
      const bounds = getGridBounds();
      const head = { x: 10, y: -1 };
      expect(hasBoundaryCollision(head, bounds)).toBe(true);
    });
  });
  
  describe('hasSelfCollision', () => {
    test('returns false when no collision', () => {
      const head = { x: 5, y: 5 };
      const body = [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 }
      ];
      expect(hasSelfCollision(head, body)).toBe(false);
    });
    
    test('returns true when head collides with body', () => {
      const head = { x: 5, y: 4 };
      const body = [
        { x: 5, y: 4 },
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 }
      ];
      expect(hasSelfCollision(head, body)).toBe(true);
    });
  });
});
```

### 11. Write Acceptance Tests

**File**: `tests/acceptance/collision-detection.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('snake crashes when hitting right grid boundary', async ({ page }) => {
  await page.goto('/');
  
  // Move snake to right boundary
  // Press 'l' (right) until collision
  
  // Wait for game-over overlay
  await expect(page.locator('text=You crashed')).toBeVisible({ timeout: 3000 });
});

test('snake crashes when hitting its own body', async ({ page }) => {
  await page.goto('/');
  
  // Maneuver snake to collide with itself
  // Create a loop pattern
  
  // Wait for game-over overlay
  await expect(page.locator('text=You crashed')).toBeVisible({ timeout: 3000 });
});

test('game displays semi-transparent overlay with message', async ({ page }) => {
  await page.goto('/');
  
  // Trigger any collision
  // Verify overlay is semi-transparent
  // Verify final snake position is visible underneath
});

test('game automatically restarts after collision', async ({ page }) => {
  await page.goto('/');
  
  // Trigger collision
  // Wait for game-over overlay
  
  // Wait 2 seconds for automatic restart
  await page.waitForTimeout(2000);
  
  // Verify game restarted:
  // - Snake at center, length 3
  // - Food visible
  // - Snake moving down
});

test('game works on all browsers', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Safari test configuration');
  
  // Run collision tests on Chrome, Firefox, Edge, Safari
  // Verify same behavior across browsers
});
```

### 12. Run Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run acceptance tests only
npm run test:acceptance
```

---

## Key Implementation Notes

### Collision Timing

- Collision check happens AFTER snake moves to new position
- Check left/top/right/bottom boundaries in `hasBoundaryCollision`
- Check all body segments (skip head) in `hasSelfCollision`
- Return first collision found (boundary check before self check)

### Grid Bounds

- Use existing `TILE_COUNT_HORIZONTAL` and `TILE_COUNT_VERTICAL` constants
- Bounds are inclusive: 0 to TILE_COUNT-  1
- Out-of-bounds positions: x < 0, x ≥ TILE_COUNT, y < 0, y ≥ TILE_COUNT

### Restart Timing

- Use `setTimeout` with 1500ms (1.5 seconds)
- Reset ALL game state to initial values
- Snake: center position, length 3, moving down
- Food: spawn at valid position
- Status: 'playing'

### Overlay Rendering

- Use `context.globalAlpha` for semi-transparency (0.7)
- Draw rectangle first (with alpha), then text (without alpha)
- Text: "You crashed" centered on canvas
- Save and restore context state to avoid affecting other rendering

---

## Testing Strategy

### Unit Tests (Vitest)

1. **Boundary Detection**: All four boundaries, positions inside/outside bounds
2. **Self-Collision**: No collision, collision with different body segments
3. **Collision Result**: Correct type returned, boundary before self

### Acceptance Tests (Playwright)

1. **Right Boundary**: Snake crashes at right edge
2. **Left Boundary**: Snake crashes at left edge
3. **Top Boundary**: Snake crashes at top edge
4. **Bottom Boundary**: Snake crashes at bottom edge
5. **Self-Collision**: Snake crashes into own body
6. **Overlay**: Semi-transparent overlay with "You crashed"
7. **Restart**: Game restarts within 1-2 seconds
8. **State Reset**: All state reset to initial values

Run tests on all browsers: Chrome, Firefox, Edge, Safari

---

## Integration Points

### Import from Snake Module

```typescript
import type { GridPosition, SnakeBody, SnakeState } from '../snake/snake-types';
import { calculateNextHeadPosition } from '../snake/snake-state';
```

### Import from Grid Module

```typescript
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';
```

### Import from Food Module

```typescript
import type { FoodState } from '../food/food-types';
import { hasFoodAtPosition } from '../food/food-state';
import { spawnFoodAtRandomPosition } from '../food/food-spawner';
```

### Export from Collision Module

```typescript
export type { GameStatus, CollisionType, GridBounds, CollisionResult } from './collision-types';
export { 
  getGridBounds, 
  isPositionWithinBounds, 
  hasBoundaryCollision, 
  hasSelfCollision, 
  detectCollision 
} from './collision-detector';
export { renderGameOverOverlay } from './game-over-overlay';
```

---

## Debugging Tips

1. **Log collision detection**: Print collision results to console for each tick
2. **Visualize boundaries**: Draw grid boundaries in different color to verify detection
3. **Test edge cases**: Snake at exact corner positions, minimum length for self-collision
4. **Check overlay rendering**: Temporarily set alpha to 1.0 to verify text display
5. **Verify restart state**: Log all state values after restart to confirm reset

---

## Performance Considerations

1. **Boundary check**: O(1) - four simple comparisons
2. **Self-collision check**: O(snake_length) - linear search through body
3. **Overall collision detection**: Negligible compared to1-second tick interval
4. **Overlay rendering**: Single draw call, no performance impact

Expected performance: Collision detection completes in <1ms on all browsers.