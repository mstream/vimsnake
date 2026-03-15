# Research: Snake Movement Control

**Feature**: 002-snake-control  
**Phase**: 0 - Research & Design Decisions  
**Date**: 2026-03-14

## Overview

This document records design decisions for implementing snake movement control using the existing grid infrastructure.

## Decision 1: Movement Timing Implementation

**Question**: How to implement the 1 cell/second movement timing?

**Decision**: Use `setInterval` with a fixed1000ms interval for game tick synchronization.

**Rationale**: 
- `setInterval` provides consistent timing intervals for game loop
- 1 second per cell movement is slow enough that drift compensation is unnecessary
- Browser's event loop timing is sufficient for this pacing
- Simpler than `requestAnimationFrame` for fixed-interval movement

**Alternatives Considered**:
- `requestAnimationFrame` with accumulated delta time - Rejected because it's unnecessarily complex for a1 Hz tick rate
- `setTimeout` with recursive calls - Rejected because drift accumulates more easily than with `setInterval`

## Decision 2: Input Queue Handling

**Question**: How to implement the single-input queue for direction changes?

**Decision**: Store only the most recent valid direction input; apply it on the next tick.

**Rationale**: 
- Simpler than multi-input queue (no ordering complexity)
- Matches spec requirement: "only the last valid input is applied"
- Provides predictable behavior for players
- Easy to test and reason about

**Implementation**:
- `pendingDirection: MovementDirection | null` stores one pending change
- On each tick: if `pendingDirection` is set, apply it and clear
- Key press updates `pendingDirection` if valid (not reversal)

## Decision 2a: Reversal Check Timing

**Question**: When checking for reversal, should we compare against current direction or pending direction?

**Decision**: Check reversal against pending direction if one exists, otherwise against current direction.

**Rationale**:
- A player pressing 'right' then 'up' expects the sequence to work
- If reversal only checked against current direction, valid sequences would be incorrectly blocked
- Example: Snake going 'down', player queues 'right' (pending), then 'up' should be allowed (up is not reversal of right)
- Creates more responsive controls while still preventing instant 180° turns

**Implementation**:
```typescript
function queueDirectionChange(state: SnakeState, newDirection: MovementDirection): SnakeState {
  const directionToCheck = state.pendingDirection ?? state.currentDirection;
  if (isDirectionReversal(directionToCheck, newDirection)) {
    return state;
  }
  return { ...state, pendingDirection: newDirection };
}
```

## Decision 3: Direction State Model

**Question**: How to represent movement direction?

**Decision**: Use TypeScript union type with four literal values.

**Rationale**:
- Type-safe representation prevents invalid directions
- Easy pattern matching for direction validation
- Clear intent through naming
- No runtime overhead

**Implementation**:
```typescript
type MovementDirection = 'up' | 'down' | 'left' | 'right';
```

## Decision 4: Snake Position Data Structure

**Question**: How to represent the snake's body positions?

**Decision**: Array of grid coordinates with head at index 0.

**Rationale**:
- Head-first ordering matches movement logic (head leads)
- Efficient iteration for rendering
- Clear relationship between indices and body segments
- Easy to add/remove segments at tail

**Implementation**:
```typescript
type GridPosition = { x: number; y: number };
type SnakeBody = GridPosition[];  // index 0 = head
```

## Decision 5: Key Event Handling

**Question**: How to capture VIM-style key input?

**Decision**: Use `keydown` event listener with key mapping.

**Rationale**:
- `keydown` captures all key presses including held keys
- Event listener pattern fits existing application structure
- Can filter for only h/j/k/l keys
- `keydown` fires once per key press (matching hold behavior)

**Implementation**:
- Single `keydown` listener in `keyboard-input.ts`
- Map: h→left, j→down, k→up, l→right
- Only process valid direction changes (not reversals)

## Decision 6: Grid Coordinate System

**Question**: How does snake position map to existing grid system?

**Decision**: Use same tile coordinate system defined in grid-constants.ts.

**Rationale**:
- Grid system already defines TILE_COUNT_HORIZONTAL and TILE_COUNT_VERTICAL
- Tile positions are 0-indexed from top-left
- Consistent with existing tile-calculation.ts metrics
- Simple coordinate math for movement

**Implementation**:
- Position (0, 0) = top-left tile
- Position (TILE_COUNT_HORIZONTAL - 1, TILE_COUNT_VERTICAL - 1) = bottom-right tile
- Head at grid center: `({Math.floor(TILE_COUNT_HORIZONTAL / 2), Math.floor(TILE_COUNT_VERTICAL / 2)})`

## Decision 7: Snake Rendering Approach

**Question**: How to render the snake on the canvas?

**Decision**: Direct canvas drawing with tile-based positioning, using existing grid metrics.

**Rationale**:
- Consistent with existing grid rendering approach
- Grid already calculates pixel offsets and tile sizes
- Snake cells fill entire tiles for clarity
- No additional rendering library needed

**Implementation**:
- Use `gridMetrics.tileSizeInPixels` from existing tile-calculation
- Draw each body segment as filled rectangle
- Use distinct color for head vs body segments

## Decision 8: Initial Snake Configuration

**Question**: Exact starting position and arrangement of 3-cell snake?

**Decision**: Head at grid center, body extends upward (against movement direction).

**Rationale**:
- Head at center specified in clarifications
- Body extends opposite to initial movement direction (downward)
- If snake moves down, body trails behind (above head)
- Three cells vertical: `[center, center-1-up, center-2-up]`

**Implementation**:
```typescript
const centerX = Math.floor(TILE_COUNT_HORIZONTAL / 2);
const centerY = Math.floor(TILE_COUNT_VERTICAL / 2);
// Snake facing down, so body above head
const initialBody: GridPosition[] = [
  { x: centerX, y: centerY },     // head
  { x: centerX, y: centerY - 1 }, // body segment 1
  { x: centerX, y: centerY - 2 }, // body segment 2
];
```

## Decision 9: Movement Tick Synchronization

**Question**: When does the snake physically move vs when is input processed?

**Decision**: Input processed immediately on keydown, movement applied on tick boundary.

**Rationale**:
- Players feel responsive (input acknowledged immediately)
- Movement still synchronized to 1-second intervals
- `pendingDirection` holds the queued change
- On tick: apply pending change, then move snake

**Flow**:
1. Key pressed → update `pendingDirection` if valid
2. Tick occurs → apply `pendingDirection` to current direction
3. Tick continues → calculate new head position
4. Update body: each segment moves to previous segment's position
5. Clear `pendingDirection`

## Decision 10: Testing Strategy

**Question**: How to prioritize tests per constitution (acceptance first)?

**Decision**: Acceptance tests validate user workflows; unit tests cover edge cases.

**Acceptance Tests (Playwright)**:
- Snake appears on grid and moves downward
- Player can change direction with h/j/k/l keys
- Direction reversal is prevented
- Multiple key presses only apply last valid direction

**Unit Tests (Vitest)**:
- Direction validation (reversal blocked)
- Position calculation for each direction
- Snake body movement logic
- Input queue behavior (last input wins)

**Rationale**:
- Acceptance tests verify user-visible behavior
- Unit tests verify edge cases (reversal prevention, boundary conditions)
- Constitution requires acceptance tests first

## Decision 11: State Synchronization Pattern

**Question**: How should keyboard input state synchronize with game loop?

**Decision**: Use pull pattern where game loop reads keyboard input state at start of each tick.

**Rationale**:
- Single source of truth for snake state (keyboard-input module holds state)
- Game loop pulls current state at tick start using `getCurrentSnakeState()`
- After processing tick, game loop syncs back using `updateSnakeState()`
- No event emission complexity needed
- Clear data flow: input → pendingDirection → game loop reads → applies → moves → syncs back

**Implementation**:
```typescript
// keyboard-input.ts
let snakeState: SnakeState | null = null;
export function getCurrentSnakeState(): SnakeState | null { return snakeState; }
export function updateSnakeState(newState: SnakeState): void { snakeState = newState; }

// game-loop.ts (tick execution)
function executeMovementTick(): void {
  const currentState = getCurrentSnakeState();
  if (currentState === null) return;
  
  const withDirection = applyPendingDirection(currentState);
  const movedState = moveSnake(withDirection);
  
  updateSnakeState(movedState);
  renderSnake(movedState.body, metrics);
}
```

## Decision 12: Tick Execution Order

**Question**: What is the exact sequence of operations within each movement tick?

**Decision**: Apply pending direction first, then move snake, then render.

**Rationale**:
- Players see direction change take effect immediately on next visible movement
- Matches intuition: "I pressed a key, the snake turns on its next move"
- Clear separation: input processed at tick boundary, movement happens after

**Tick Sequence**:
1. Pull current state from keyboard-input module
2. Apply pendingDirection to currentDirection (if pending exists)
3. Clear pendingDirection
4. Calculate new head position based on currentDirection
5. Update body (each segment follows previous)
6. Sync state back to keyboard-input module
7. Render snake in final position