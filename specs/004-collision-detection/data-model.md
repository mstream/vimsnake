# Data Model: Collision Detection

**Feature**: 004-collision-detection  
**Date**: 2026-03-19  
**Source**: [spec.md](./spec.md)

## Entities

### GameStatus

Represents the current state of the game (playing or game-over).

**Type**: Enum

**Values**:
- `playing`: Game is active, snake can move and eat food
- `game-over`: Game has ended due to collision, waiting for automatic restart

**State Transitions**:
1. **Game Start**: Initialize to `'playing'`
2. **Collision Detected**: Transition from `'playing'` to `'game-over'`
3. **Automatic Restart**: Transition from `'game-over'` to `'playing'` after 1-2 seconds

---

### GameState (Extension)

Extends existing game state to include game status.

**Existing Fields** (from previous features):
- `snakeState`: Current snake state (body, direction)
- `foodState`: Current food state (position, existence)
- `isSnakeGrowing`: Flag to control snake growth

**New Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| gameStatus | GameStatus | Current game state | 'playing' or 'game-over' |

**State Transitions**:

1. **Game Start**:
   - `gameStatus`: 'playing'
   - (existing fields initialized)

2. **Collision Detected**:
   - `gameStatus`: 'playing' → 'game-over'
   - Snake stops moving
   - Overlay displays
   - 1.5 second timer starts

3. **Automatic Restart**:
   - `gameStatus`: 'game-over' → 'playing'
   - All state reset to initial values (snake at center, length 3, moving down)
   - Food repositioned
   - Overlay removed

---

### CollisionType

Represents the type of collision detected.

**Type**: Enum

**Values**:
- `boundary`: Snake head moved outside grid bounds
- `self`: Snake head moved onto body segment

**Usage**: Used in collision detection functions to identify collision cause

---

### GridBounds

Represents the boundaries of the game grid.

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| minimumX | number | Minimum valid x coordinate (column) | Constant: 0 |
| maximumX | number | Maximum valid x coordinate (column) | Constant: TILE_COUNT_HORIZONTAL - 1 |
| minimumY | number | Minimum valid y coordinate (row) | Constant: 0 |
| maximumY | number | Maximum valid y coordinate (row) | Constant: TILE_COUNT_VERTICAL - 1 |

**Usage**: Passed to boundary collision detection functions

---

### CollisionResult

Represents the result of collision detection check.

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| hasCollision | boolean | Whether collision was detected | True or false |
| collisionType | CollisionType \| null | Type of collision if detected | 'boundary' or 'self' or null |

**Usage**: Returned from collision detection functions to communicate collision status

---

## Entity Relationships

```
GameState
├── snakeState: SnakeState
│   ├── body: SnakeBody (array of GridPosition)
│   │   └── Each segment: { x: number, y: number }
│   └── currentDirection: MovementDirection
├── foodState: FoodState
│   └── position: FoodPosition | null
├── isSnakeGrowing: boolean
└── gameStatus: GameStatus ('playing' | 'game-over')

Collision Detection:
├── Check: isPositionWithinBounds(snakeHead, gridBounds)
│   └── Returns false if boundary collision
├── Check: isSnakeHeadOnBody(snakeHead, snakeBody)
│   └── Returns true if self collision
└── If either true → set gameStatus = 'game-over'
```

---

## State Transitions

### Collision Detection Flow

```
┌─────────────────┐
│  Playing State  │
│  gameStatus =   │
│   'playing'     │
└────────┬────────┘
         │
         ▼
    Snake Move
         │
         ▼
    Check Collision
         │
    ┌────┴────┐
    │         │
   No        Yes
    │         │
    ▼         ▼
 Continue   Set Status
 Playing    'game-over'
    │         │
    │         ▼
    │   Show Overlay
    │         │
    │         ▼
    │   Wait 1.5s
    │         │
    │         ▼
    │   Restart Game
    │    (reset state)
    │         │
    └─────────┘
         │
         ▼
 Continue Playing
```

### Game Loop Integration

```
┌─────────────────────────────┐
│  Game Loop Tick (1 second)   │
└─────────────┬───────────────┘
              │
              ▼
        Game Status?
              │
       ┌──────┴──────┐
       │             │
   'playing'     'game-over'
       │             │
       └─────────────┘
       (ignore ticks)
```

---

## Validation Functions

### isPositionWithinBounds

**Type**: (position: GridPosition, bounds: GridBounds) => boolean

**Purpose**: Checks if a position is within the grid boundaries

**Logic**:
1. Check if `position.x >= bounds.minimumX`
2. Check if `position.x <= bounds.maximumX`
3. Check if `position.y >= bounds.minimumY`
4. Check if `position.y <= bounds.maximumY`
5. Return true only if all conditions met

### hasBoundaryCollision

**Type**: (head: GridPosition, bounds: GridBounds) => boolean

**Purpose**: Checks if snake head is outside grid bounds

**Logic**:
1. Call `isPositionWithinBounds(head, bounds)`
2. Return inverse of result

### hasSelfCollision

**Type**: (head: GridPosition, body: SnakeBody) => boolean

**Purpose**: Checks if snake head position collides with any body segment

**Logic**:
1. Skip first segment (head) in body array
2. For each remaining segment in body:
   - Check if `segment.x === head.x && segment.y === head.y`
   - If match found, return true
3. Return false if no match found

### detectCollision

**Type**: (snakeState: SnakeState) => CollisionResult

**Purpose**: Detects any collision (boundary or self)

**Logic**:
1. Get snake head position (first element of body)
2. Get grid bounds (from constants)
3. If `hasBoundaryCollision(head, bounds)` → return `{ hasCollision: true, collisionType: 'boundary' }`
4. If `hasSelfCollision(head, body)` → return `{ hasCollision: true, collisionType: 'self' }`
5. Return `{ hasCollision: false, collisionType: null }`

---

## Type Definitions

### GameStatus

```typescript
export type GameStatus = 'playing' | 'game-over';
```

### CollisionType

```typescript
export type CollisionType = 'boundary' | 'self';
```

### GridBounds

```typescript
export interface GridBounds {
  minimumX: number;
  maximumX: number;
  minimumY: number;
  maximumY: number;
}
```

### CollisionResult

```typescript
export interface CollisionResult {
  hasCollision: boolean;
  collisionType: CollisionType | null;
}
```

### Extended GameState

```typescript
import type { SnakeState } from '../snake/snake-types';
import type { FoodState } from '../food/food-types';
import type { GameStatus } from './collision-types';

export interface GameState {
  snakeState: SnakeState;
  foodState: FoodState;
  isSnakeGrowing: boolean;
  gameStatus: GameStatus;
}
```

---

## Assumptions

1. **Grid Bounds**: Uses existing `TILE_COUNT_HORIZONTAL` and `TILE_COUNT_VERTICAL` constants for boundary calculation
2. **Coordinate System**: Grid positions use (x, y) where x is column index and y is row index, both 0-indexed
3. **Snake Body Order**: First element in body array is the head, last is the tail
4. **Collision Timing**: Collision is detected AFTER movement, meaning the snake briefly occupies the collision position before game ends
5. **Overlay Timing**: 1.5 seconds is chosen as the middle of the 1-2 second requirement from spec
6. **No Persistence**: Game state is in-memory only, reset on restart (consistent with existing architecture)
7. **Canvas Rendering**: Overlay rendered on same canvas as game grid (consistent with existing rendering approach)