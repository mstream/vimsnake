# Module Integration Contracts: Food Spawning

**Feature**: 003-food-spawning  
**Date**: 2026-03-18  
**Type**: Internal Module Interfaces

## Overview

This document defines the integration contracts between the new `food` module and existing game modules. Since this is a browser-based game with no external APIs, contracts focus on internal module interfaces and state update patterns.

---

## Contract: Food Module Public Interface

### Module: `src/food/`

The food module exports the following public interface for use by other modules.

#### Types

```typescript
// food-types.ts
export interface FoodPosition {
  x: number;
  y: number;
}

export interface FoodState {
  position: FoodPosition | null;
}
```

#### State Management Functions

```typescript
// food-state.ts

export function createInitialFoodState(
  snakeBody: SnakeBody
): FoodState;

export function hasFoodAtPosition(
  foodState: FoodState,
  position: GridPosition
): boolean;
```

#### Spawning Functions

```typescript
// food-spawner.ts

export function findValidFoodPositions(
  snakeBody: SnakeBody
): FoodPosition[];

export function spawnFoodAtRandomPosition(
  snakeBody: SnakeBody
): FoodPosition;

export function hasValidFoodPositions(
  snakeBody: SnakeBody
): boolean;
```

**Contract Invariant**:
- `spawnFoodAtRandomPosition` MUST throw if `hasValidFoodPositions(snakeBody) === false`
- `spawnFoodAtRandomPosition` MUST return position that passes validation:
  - Position is within grid bounds
  - Position is not occupied by snake body
  - Position is not adjacent to any snake segment

---

## Contract: Game State Integration

### Extension to GameState

The GameState type must be extended to include food state:

```typescript
// game/game-types.ts (NEW or extended)

export interface GameState {
  snakeState: SnakeState;
  foodState: FoodState;
  isSnakeGrowing: boolean;
}
```

**Contract Requirements**:
1. `foodState` MUST be initialized before game starts
2. `isSnakeGrowing` MUST be `false` at game start
3. `isSnakeGrowing` MUST be `true` only immediately after food consumption
4. `isSnakeGrowing` MUST be reset to `false` after one move cycle

---

## Contract: Snake Growth Integration

### Growth Signaling

When food is consumed, the game must signal snake growth:

**Process**:
1. Snake head moves onto food position
2. `isSnakeGrowing` flag set to `true`
3. Food removed from grid
4. New food spawned (or State set to no-food if no valid positions)
5. On next move: snake does NOT remove tail, `isSnakeGrowing` resets to `false`

**Contract Function**:

```typescript
// game/game-state.ts

export function consumeFood(gameState: GameState): GameState {
  // Implementation must:
  // 1. Set isSnakeGrowing = true
  // 2. Remove food (set position to null)
  // 3. Spawn new food if valid positions exist
}
```

---

## Contract: Adjacency Calculation

### Adjacency Check Function

The food module must provide adjacency checking:

```typescript
// food/food-adjacency.ts

export function getPositionsAdjacentTo(
  position: GridPosition
): GridPosition[];

export function isPositionAdjacentToSnakeBody(
  position: GridPosition,
  snakeBody: SnakeBody
): boolean;

export function getInvalidPositionsForFood(
  snakeBody: SnakeBody
): Set<string>;
```

**Contract Guarantees**:
- `getPositionsAdjacentTo` returns exactly 8 positions (or fewer at grid boundaries)
- `isPositionAdjacentToSnakeBody` checks all 8 adjacent cells
- `getInvalidPositionsForFood` returns positions that combine:
  - All snake body positions
  - All positions adjacent to snake body
  - Positions are encoded as strings in format "x,y"

---

## Contract: Game Loop Integration

### Update Cycle

The game loop must coordinate food spawning in the update phase:

**Update Contract**:

```typescript
// game/game-loop.ts

export function updateGameState(currentState: GameState): GameState {
  // 1. Check if snake head is on food position
  if (hasFoodAtPosition(currentState.foodState, currentState.snakeState.body[0])) {
    // a. Set isSnakeGrowing = true
    // b. Remove food
    // c. Spawn new food if possible
  }
  
  // 2. Apply pending direction
  // 3. Move snake (skip tail removal if isSnakeGrowing)
  // 4. Reset isSnakeGrowing to false if it was true
}
```

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
}
```

---

## Contract: Initial State Creation

### Game Initialization

When creating initial game state:

```typescript
// game/game-state.ts

export function createInitialGameState(): GameState {
  const snakeState = createInitialSnakeState();
  const foodPosition = spawnFoodAtRandomPosition(snakeState.body);
  
  return {
    snakeState,
    foodState: { position: foodPosition },
    isSnakeGrowing: false,
  };
}
```

**Contract Requirements**:
- Initial food MUST be spawned away from initial snake body
- Initial food MUST not be adjacent to initial snake body
- `isSnakeGrowing` MUST start as `false`

---

## Contract: Edge Case Handling

### No Valid Food Positions

When `hasValidFoodPositions(snakeBody) === false`:

**Contract Requirements**:
- `spawnFoodAtRandomPosition` MUST throw an error
- Game state MUST set `foodState.position` to `null`
- Game MUST continue running (snake can still move)
- Rendering MUST handle `position: null` gracefully (no food displayed)

**Implementation Pattern**:

```typescript
export function spawnFoodOrStop(gameState: GameState): GameState {
  if (hasValidFoodPositions(gameState.snakeState.body)) {
    const position = spawnFoodAtRandomPosition(gameState.snakeState.body);
    return {
      ...gameState,
      foodState: { position }
    };
  }
  // No valid positions - stop placing food
  return {
    ...gameState,
    foodState: { position: null }
  };
}
```

---

## Contract: Test Integration

### Acceptance Test Requirements

All acceptance tests must verify:

1. **Initial spawn**: Food appears on game start at valid position
2. **Adjacency check**: Food not adjacent to snake
3. **Consumption**: Food disappears when snake head overlaps
4. **Growth**: Snake grows by one segment
5. **Respawn**: New food appears at valid position after consumption
6. **No valid cells**: Game handles gracefully when no valid food positions

**Test Contract**:

```typescript
// tests/acceptance/food-spawning.spec.ts

test('food spawns away from snake body and adjacency', () => {
  // Must verify food position is:
  // - Within grid bounds
  // - Not on snake body
  // - Not adjacent to snake body (8-way)
});

test('snake grows when consuming food', () => {
  // Must verify:
  // - Food disappears
  // - Snake length increases by 1
  // - New food appears
});

test('game handles no valid food positions', () => {
  // Must verify:
  // - No crash when no valid cells exist
  // - foodPosition is null
  // - Game continues
});
```

---

## Summary

### Contract Checklist

Before integration, verify:

- [ ] `FoodPosition` type matches `GridPosition` structure
- [ ] `createInitialFoodState` spawns food away from snake
- [ ] `isPositionAdjacentToSnakeBody` checks all 8 directions
- [ ] `spawnFoodAtRandomPosition` throws when no valid positions
- [ ] `GameState` includes `foodState` and `isSnakeGrowing`
- [ ] Game loop handles food consumption in update phase
- [ ] Renderer handles `foodState.position === null`
- [ ] All acceptance tests pass on Chrome, Firefox, Edge, Safari