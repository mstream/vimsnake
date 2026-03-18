# Quick Start: Food Spawning Implementation

**Feature**: 003-food-spawning  
**Time Estimate**: 4-6 hours  
**Prerequisites**: Grid rendering (001), Snake control (002)

## Implementation Steps

### 1. Create Food Module Structure

Create the `src/food/` directory with four files:

```bash
mkdir -p src/food
touch src/food/food-types.ts
touch src/food/food-constants.ts
touch src/food/food-state.ts
touch src/food/food-spawner.ts
touch src/food/food-adjacency.ts
```

### 2. Define Food Types

**File**: `src/food/food-types.ts`

```typescript
export interface FoodPosition {
  x: number;
  y: number;
}

export interface FoodState {
  position: FoodPosition | null;
}
```

### 3. Create Food Constants (if needed)

**File**: `src/food/food-constants.ts`

Add constants for food rendering (colors, sizes, etc.) as needed.

### 4. Implement Adjacency Calculation

**File**: `src/food/food-adjacency.ts`

```typescript
import type { GridPosition, SnakeBody } from '../snake/snake-types';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function getPositionsAdjacentTo(position: GridPosition): GridPosition[] {
  // Return 8 adjacent positions (filter out-of-bounds)
}

export function isPositionAdjacentToSnakeBody(
  position: GridPosition,
  snakeBody: SnakeBody
): boolean {
  // Check if position is adjacent to any snake segment
}

export function getInvalidPositionsForFood(snakeBody: SnakeBody): Set<string> {
  // Return set of "x,y" strings for invalid positions
}
```

### 5. Implement Food Spawner

**File**: `src/food/food-spawner.ts`

```typescript
import type { FoodPosition } from './food-types';
import type { SnakeBody } from '../snake/snake-types';
import { getInvalidPositionsForFood } from './food-adjacency';
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';

export function findValidFoodPositions(snakeBody: SnakeBody): FoodPosition[] {
  // Generate all grid positions
  // Filter out invalid positions
  // Return valid position array
}

export function hasValidFoodPositions(snakeBody: SnakeBody): boolean {
  // Return true if findValidFoodPositions has results
}

export function spawnFoodAtRandomPosition(snakeBody: SnakeBody): FoodPosition {
  // Get valid positions
  // Select random position
  // Throw if no valid positions
}
```

### 6. Implement Food State

**File**: `src/food/food-state.ts`

```typescript
import type { FoodState, FoodPosition } from './food-types';
import type { SnakeBody } from '../snake/snake-types';
import type { GridPosition } from '../snake/snake-types';
import { spawnFoodAtRandomPosition } from './food-spawner';

export function createInitialFoodState(snakeBody: SnakeBody): FoodState {
  const position = spawnFoodAtRandomPosition(snakeBody);
  return { position };
}

export function hasFoodAtPosition(
  foodState: FoodState,
  position: GridPosition
): boolean {
  // Check if food position matches given position
}

export function consumeFood(
  foodState: FoodState,
  snakeBody: SnakeBody
): FoodState {
  // Set position to null or spawn new food
}
```

### 7. Extend Game State

**File**: Create or extend `src/game/game-types.ts`

```typescript
import type { SnakeState } from '../snake/snake-types';
import type { FoodState } from '../food/food-types';

export interface GameState {
  snakeState: SnakeState;
  foodState: FoodState;
  isSnakeGrowing: boolean;
}
```

**File**: Create or extend `src/game/game-state.ts`

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
  };
}

export function consumeFood(gameState: GameState): GameState {
  // Set isSnakeGrowing = true
  // Remove food or spawn new
}
```

### 8. Modify Snake Movement

**File**: Modify `src/snake/snake-state.ts`

```typescript
export function moveSnake(
  state: SnakeState,
  isGrowing: boolean
): SnakeState {
  const newHead = calculateNextHeadPosition(state.body[0], state.currentDirection);
  
  const newBody = isGrowing
    ? [newHead, ...state.body]
    : [newHead, ...state.body.slice(0, -1)];
  
  return {
    ...state,
    body: newBody,
  };
}
```

### 9. Update Game Loop

**File**: Modify `src/game/game-loop.ts`

```typescript
export function updateGameState(currentState: GameState): GameState {
  // Check if snake head is on food
  if (hasFoodAtPosition(currentState.foodState, currentState.snakeState.body[0])) {
    currentState = consumeFood(currentState);
  }
  
  // Apply pending direction
  // Move snake with growth flag
  // Reset isSnakeGrowing
}
```

### 10. Add Food Rendering

**File**: Create or modify `src/food/food-renderer.ts`

```typescript
import type { FoodState } from './food-types';
import type { GridRenderMetrics } from '../grid/grid-constants';

const FOOD_COLOR = '#ff0000'; // Example color

export function renderFood(
  context: CanvasRenderingContext2D,
  foodState: FoodState,
  metrics: GridRenderMetrics
): void {
  if (foodState.position === null) return;
  
  // Draw food at position using metrics
}
```

### 11. Write Tests

**Unit Tests**: `tests/unit/food/`

Create test files for:
- `food-adjacency.test.ts`: Test adjacency calculations
- `food-spawner.test.ts`: Test random position selection
- `food-state.test.ts`: Test state management

**Acceptance Tests**: `tests/acceptance/food-spawning.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('food appears on game start', async ({ page }) => {
  // Navigate to game
  // Verify food is visible
  // Verify food is not on or adjacent to snake
});

test('snake grows when eating food', async ({ page }) => {
  // Move snake to food
  // Verify snake length increases
  // Verify new food appears
});

// More tests...
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

### Adjacency Calculation

- Check all 8 directions: N, NE, E, SE, S, SW, W, NW
- Filter out positions outside grid bounds
- Use Set<string> for O(1) lookup of invalid positions

### Random Position Selection

- Use `Math.random()` for random selection
- Create pool of valid positions first
- Select random index from pool
- Throw error if pool is empty (no valid positions)

### Snake Growth

- Pass `isGrowing` flag to `moveSnake`
- Skip tail removal when flag is true
- Reset flag after move completes

### State Immutability

- All state updates return new state objects
- Never mutate state directly
- Follow existing pattern from `snake-state.ts`

---

## Testing Strategy

### Unit Tests (Vitest)

1. **Adjacency Calculation**: Corner cases, edge positions
2. **Position Validation**: Bounds checking, overlap detection
3. **Random Selection**: Valid pool generation, edge case (empty pool)

### Acceptance Tests (Playwright)

1. **Initial Spawn**: Food appears at game start in valid position
2. **Adjacency**: Food never adjacent to snake
3. **Consumption**: Food disappears, snake grows
4. **Respawn**: New food appears after consumption
5. **Edge Case**: No valid positions handled gracefully

Run tests on all browsers: Chrome, Firefox, Edge, Safari

---

## Integration Points

### Import from Snake Module

```typescript
import type { SnakeBody, GridPosition } from '../snake/snake-types';
import { createInitialSnakeState } from '../snake/snake-state';
```

### Import from Grid Module

```typescript
import { TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL } from '../grid/grid-constants';
```

### Export from Food Module

```typescript
export type { FoodPosition, FoodState } from './food-types';
export { createInitialFoodState, hasFoodAtPosition } from './food-state';
export { spawnFoodAtRandomPosition, hasValidFoodPositions } from './food-spawner';
```

---

## Debugging Tips

1. **Log invalid position count**: Check how many valid cells exist
2. **Visualize grid**: Draw invalid cells in different color to verify adjacency calculation
3. **Test edge cases**: Snake at corners, long snake filling grid
4. **Check Math.random() distribution**: Ensure random selection is uniform

---

## Performance Considerations

1. **Pool-based selection**: O(GRID_SIZE) to build pool, O(1) to select
2. **Adjacency calculation**: O(snake_length) per spawn
3. **Set lookups**: O(1) for invalid position checks

Expected performance: <100ms for food spawning on 32x32 grid with typical snake lengths.