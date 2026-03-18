# Data Model: Food Spawning

**Feature**: 003-food-spawning  
**Date**: 2026-03-18  
**Source**: [spec.md](./spec.md)

## Entities

### FoodPosition

Represents the location of food on the grid.

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| x | number | Horizontal coordinate (column index) | Integer, 0 ≤ x < TILE_COUNT_HORIZONTAL |
| y | number | Vertical coordinate (row index) | Integer, 0 ≤ y < TILE_COUNT_VERTICAL |

**State**: Immutable when created, replaced when new food spawns

**Relationships**:
- References `GridPosition` type from `snake-types.ts`
- Must not overlap with any `SnakeSegment`
- Must not be adjacent (8-way) to any `SnakeSegment`

**Validation Rules**:
- Position must be within grid bounds
- Position must not be occupied by snake body
- Position must not be adjacent to snake body (all 8 surrounding cells)
- One food position exists at a time (or none if no valid cells)

---

### GameState (Extension)

Extends existing game state to include food information.

**Existing Fields** (from previous features):
- `snakeState`: Current snake state (body, direction)
- Grid constants and metrics

**New Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| foodPosition | FoodPosition \| null | Current food location | null if no valid cells exist |
| isSnakeGrowing | boolean | Flag to skip tail removal | Initially false, set true when food consumed |

**State Transitions**:

1. **Game Start**:
   - `foodPosition`: null → valid position (spawn initial food)
   - `isSnakeGrowing`: false

2. **Food Consumed**:
   - `isSnakeGrowing`: false → true (trigger growth)
   - `foodPosition`: current position → null (remove consumed food)
   - Then immediately: null → valid position (spawn new food) or null (if no valid cells)

3. **Snake Move** (when `isSnakeGrowing` is true):
   - `isSnakeGrowing`: true → false
   - Snake body grows by one segment (tail not removed)

---

### InvalidCellSet (Computed)

Represents cells where food cannot spawn.

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| positions | Set\<string\> | Grid positions as strings in "x,y" format |

**Computation** (calculated on each food spawn):
1. For each snake segment (x, y):
   - Add segment position to set
   - Add all 8 adjacent positions to set:
     - (x-1, y-1), (x-1, y), (x-1, y+1)
     - (x, y-1), (x, y+1)
     - (x+1, y-1), (x+1, y), (x+1, y+1)
2. Filter positions outside grid bounds

**Usage**: Used to determine valid spawn positions for food

---

## Entity Relationships

```
GameState
├── snakeState: SnakeState
│   └── body: SnakeBody (array of GridPosition)
│       └── Each segment: { x: number, y: number }
├── foodPosition: FoodPosition | null
│   └── { x: number, y: number }
├── isSnakeGrowing: boolean
└── Grid constants (from grid/ module)

FoodPosition constraints:
├── Must not equal any SnakeBody position
└── Must not be adjacent to any SnakeBody position (8-way adjacency)
```

---

## State Transitions

### Food Spawn Cycle

```
┌─────────────────┐
│  Game Start     │
│  (no food)      │
└────────┬────────┘
         │
         ▼
    Spawn Food
         │
         ▼
┌─────────────────┐
│  Food Active    │◄─────┐
│  (one food)     │      │
└────────┬────────┘      │
         │               │
    Snake eats food      │
         │               │
         ▼               │
    Remove food          │
    Set growth flag      │
         │               │
         ▼               │
    Valid cells?         │
         │               │
    ┌────┴────┐          │
    │         │          │
   Yes        No         │
    │         │          │
    │         ▼          │
    │    No food         │
    │    (game ends      │
    │     or continues)  │
    │                   │
    ▼                   │
 Spawn new food ────────┘
```

### Snake Growth Cycle

```
┌─────────────────┐
│  Normal Move    │
│  isGrowing=false│
└────────┬────────┘
         │
         ▼
    Move snake
    (remove tail)
         │
         ▼
    Normal state
         
┌─────────────────┐
│  Food Consumed  │
│  isGrowing=true │
└────────┬────────┘
         │
         ▼
    Move snake
    (keep tail)
         │
         ▼
┌─────────────────┐
│  isGrowing=false│
└─────────────────┘
```

---

## Validation Functions

### isValidFoodPosition

**Type**: (position: FoodPosition, snakeBody: SnakeBody) => boolean

**Purpose**: Checks if a position is valid for food placement

**Logic**:
1. Check if position is within grid bounds
2. Check if position is not occupied by snake body
3. Check if position is not adjacent to any snake segment

### findValidFoodPositions

**Type**: (snakeBody: SnakeBody, gridBounds: GridBounds) => FoodPosition[]

**Purpose**: Returns all valid positions where food can spawn

**Logic**:
1. Create set of invalid positions (snake body + adjacency)
2. Generate all grid positions
3. Filter out invalid positions
4. Return valid position array

### hasValidFoodPosition

**Type**: (snakeBody: SnakeBody, gridBounds: GridBounds) => boolean

**Purpose**: Checks if any valid food position exists

**Logic**:
1. Call `findValidFoodPositions`
2. Return `positions.length > 0`

---

## Type Definitions

### FoodPosition

```typescript
export interface FoodPosition {
  x: number;
  y: number;
}
```

**Note**: Identical to `GridPosition` from `snake-types.ts`, but separate type for clarity.

### FoodState

```typescript
export interface FoodState {
  position: FoodPosition | null;
}
```

### Extended GameState

```typescript
export interface GameState {
  snakeState: SnakeState;
  foodState: FoodState;
  isSnakeGrowing: boolean;
}
```

---

## Assumptions

1. **Grid Bounds**: Uses existing `TILE_COUNT_HORIZONTAL` and `TILE_COUNT_VERTICAL` constants
2. **Coordinate System**: Grid positions use (x, y) where x is column index and y is row index
3. **Type Reuse**: `FoodPosition` is structurally identical to `GridPosition` but kept separate for domain clarity
4. **Single Food**: Only one food item exists at a time (as per spec)
5. **No Persistence**: Game state is in-memory only (consistent with existing architecture)