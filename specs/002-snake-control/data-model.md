# Data Model: Snake Movement Control

**Feature**: 002-snake-control  
**Phase**: 1 - Design  
**Date**: 2026-03-14

## Overview

This document defines the data structures, types, and state management for the snake movement feature.

## Core Types

### MovementDirection

Represents the four cardinal directions the snake can move.

```typescript
type MovementDirection = 'up' | 'down' | 'left' | 'right';
```

**Validation Rules**:
- Valid values: exactly 'up', 'down', 'left', 'right'
- No other values permitted (TypeScript enforcement)

**State Transitions**:
| Current Direction | Valid Next Directions | Invalid (Reversal) |
|-------------------|----------------------|-------------------|
| up| left, right, up | down |
| down | left, right, down | up |
| left | up, down, left | right |
| right | up, down, right | left |

### GridPosition

Represents a single tile coordinate on the game grid.

```typescript
interface GridPosition {
  x: number;  // 0 to TILE_COUNT_HORIZONTAL - 1
  y: number;  // 0 to TILE_COUNT_VERTICAL - 1
}
```

**Validation Rules**:
- `x` must be within `0 <= x < TILE_COUNT_HORIZONTAL`
- `y` must be within `0 <= y < TILE_COUNT_VERTICAL`
- Coordinates are integers

**Equality**: Two positions are equal if both `x` and `y` match.

### SnakeBody

Ordered array of grid positions representing the snake from head to tail.

```typescript
type SnakeBody = GridPosition[];
```

**Invariants**:
- Array must have at least 1 element (head)
- No position may appear twice (no self-intersection)
- Order: index 0 = head, last index = tail
- Initial length: 3 cells

### SnakeState

Complete state of the snake entity.

```typescript
interface SnakeState {
  body: SnakeBody;
  currentDirection: MovementDirection;
  pendingDirection: MovementDirection | null;
}
```

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| body | SnakeBody | Ordered positions from head to tail |
| currentDirection | MovementDirection | Direction snake is currently moving |
| pendingDirection | MovementDirection \| null | Queued direction change, applied next tick |

**Invariants**:
- `pendingDirection` cannot be the reversal of `currentDirection`
- `body.length` equals snake length (3 at start)
- All positions are within grid boundaries

## State Management

### Initial State

```typescript
const INITIAL_SNAKE_LENGTH = 3;
const HEAD_COLOR = '#22c55e';    // Green for head
const BODY_COLOR = '#16a34a';    // Darker green for body

function createInitialSnakeState(gridWidth: number, gridHeight: number): SnakeState {
  const centerX = Math.floor(gridWidth / 2);
  const centerY = Math.floor(gridHeight / 2);
  
  return {
    body: [
      { x: centerX, y: centerY },// head
      { x: centerX, y: centerY - 1 }, // body segment 1
      { x: centerX, y: centerY - 2 },  // body segment 2
    ],
    currentDirection: 'down',
    pendingDirection: null,
  };
}
```

### State Transitions

#### Move Snake

```typescript
function moveSnake(state: SnakeState): SnakeState {
  const newHead = calculateNextHeadPosition(state.body[0], state.currentDirection);
  const newBody = [newHead, ...state.body.slice(0, -1)];
  
  return {
    ...state,
    body: newBody,
  };
}
```

#### Apply Pending Direction

```typescript
function applyPendingDirection(state: SnakeState): SnakeState {
  if (state.pendingDirection === null) {
    return state;
  }
  
  return {
    ...state,
    currentDirection: state.pendingDirection,
    pendingDirection: null,
  };
}
```

#### Queue Direction Change

```typescript
function queueDirectionChange(
  state: SnakeState,
  newDirection: MovementDirection
): SnakeState {
  const directionToCheck = state.pendingDirection ?? state.currentDirection;
  if (isDirectionReversal(directionToCheck, newDirection)) {
    return state;  // Ignore reversal
  }
  
  return {
    ...state,
    pendingDirection: newDirection,
  };
}
```

**Note**: Reversal is checked against `pendingDirection` if set, otherwise `currentDirection`. This allows players to queue valid turn sequences (e.g., going down, queue right, then queue up - valid because up is not reversal of right).

## Movement Calculations

### Direction Vectors

```typescript
const DIRECTION_VECTORS: Record<MovementDirection, GridPosition> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
```

### Head Position Calculation

```typescript
function calculateNextHeadPosition(
  currentHead: GridPosition,
  direction: MovementDirection
): GridPosition {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  };
}
```

### Reversal Check

```typescript
const OPPOSITE_DIRECTIONS: Record<MovementDirection, MovementDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

function isDirectionReversal(
  current: MovementDirection,
  proposed: MovementDirection
): boolean {
  return OPPOSITE_DIRECTIONS[current] === proposed;
}
```

## Key Input Mapping

### VIM Key Bindings

```typescript
const KEY_TO_DIRECTION: Record<string, MovementDirection> = {
  'h': 'left',
  'j': 'down',
  'k': 'up',
  'l': 'right',
};
```

## Rendering Data

### Snake Renderer Interface

```typescript
interface SnakeRenderMetrics {
  tileSizeInPixels: number;
  offsetX: number;
  offsetY: number;
}
```

**Usage**: Passed from existing `calculateGridRenderMetrics` in tile-calculation.ts.

## Entity Summary

| Entity | Purpose | Location |
|--------|---------|----------|
| MovementDirection | Type for four cardinal directions | snake-types.ts |
| GridPosition | Interface for tile coordinates | snake-types.ts |
| SnakeBody | Type alias for ordered positions | snake-types.ts |
| SnakeState | Complete snake state interface | snake-state.ts |
| DIRECTION_VECTORS | Movement delta per direction | snake-constants.ts |
| OPPOSITE_DIRECTIONS | Reversal lookup map | snake-constants.ts |
| KEY_TO_DIRECTION | VIM key mapping | snake-constants.ts |