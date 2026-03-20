# Research: Collision Detection

**Feature**: 004-collision-detection  
**Date**: 2026-03-19  
**Purpose**: Resolve technical questions and establish implementation approach

## Research Tasks

### 1. Collision Detection Timing

**Question**: When should collision detection be checked in the game loop relative to snake movement?

**Findings**:

**Approach 1: Before Movement (Preventive)**
- Check if next position would cause collision
- Don't allow snake to move into collision
- Game never enters invalid state
- More complex logic

**Approach 2: After Movement (Reactive)**
- Move snake first
- Check if current position has collision
- Simpler logic but snake briefly in invalid position
- Easier to understand and test

**Decision**: Approach 2 (After Movement - Reactive)

**Rationale**: 
- Aligns with spec language: "When the snake's head reaches/reaches" implies movement to collision position
- Simpler to implement and test
- Clear timing: move → check → render (or end game)
- Consistent with existing food consumption pattern in game loop
- No need to predict collision before it happens

**Alternatives Considered**:
- Before Movement: Rejected as more complex and not aligned with spec's reactive language

---

### 2. Boundary Detection Implementation

**Question**: How to efficiently check if snake head is outside grid bounds?

**Findings**:

**Approach 1: Direct Comparison**
- Check: `head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT`
- O(1) complexity
- Simple and direct
- No memory overhead

**Approach 2: Bounding Box Function**
- Create reusable `isPositionWithinBounds(position, bounds)` function
- Slightly more abstraction
- Easier to test edge cases
- Follows constitution's self-documenting code principle

**Decision**: Approach 2 (Bounding Box Function)

**Rationale**:
- More readable: `isPositionWithinBounds(head, gridBounds)`
- Reusable for future features
- Easier to test bounds logic in isolation
- Self-documenting name expresses intent clearly
- Follows existing codebase pattern of small, focused functions

**Alternatives Considered**:
- Direct Comparison: Rejected as less readable and harder to test in isolation

---

### 3. Self-Collision Detection Implementation

**Question**: How to efficiently check if snake head collides with its own body?

**Findings**:

**Approach 1: Linear Search**
- Check if head position equals any body segment
- O(snake_length) complexity
- Simple to implement
- Sufficient for typical snake lengths (rarely >100)

**Approach 2: Set-Based Lookup**
- Maintain Set of snake body positions for O(1) lookup
- More complex state management
- Must keep Set synchronized with snake body
- Better for very long snakes

**Decision**: Approach 1 (Linear Search)

**Rationale**:
- Snake games typically have limited length (36x36 grid with food limitation)
- Linear search is O(snake_length) which is acceptable for typical lengths
- Simpler implementation with no additional state management
- No synchronization overhead between body array and Set
- Follows constitution's principle of avoiding unnecessary complexity
- Performance is negligible compared to 1-second movement tick

**Alternatives Considered**:
- Set-Based Lookup: Rejected due to complexity overhead without clear benefit for typical snake game scenarios

---

### 4. Game Over State Management

**Question**: How should game-over state be represented and transitioned?

**Findings**:

**Current Game State Structure** (from food spawning):
```
GameState
├── snakeState: SnakeState
├── foodState: FoodState
└── isSnakeGrowing: boolean
```

**Proposed Addition**:
```
GameState
├── snakeState: SnakeState
├── foodState: FoodState
├── isSnakeGrowing: boolean
└── gameStatus: 'playing' | 'game-over'  [NEW]
```

**Decision**: Add `gameStatus` enum to GameState

**Rationale**:
- Explicit state management (playing vs game-over)
- Clear transition points: collision detected → set status to 'game-over'
- Enables restart logic: 'game-over' → 'playing' with reset
- Self-documenting: status name clearly indicates current game phase
- Follows state machine pattern from existing architecture

**Alternatives Considered**:
- Boolean `isGameOver`: Rejected as less clear and harder to extend for future states
- Separate GameOverState: Rejected as creates unnecessary state fragmentation

---

### 5. Overlay Implementation

**Question**: How should the game-over overlay be rendered and managed?

**Findings**:

**Approach 1: Canvas-Based Overlay**
- Draw semi-transparent rectangle on canvas
- Draw text on canvas
- Requires manual positioning and styling
- Consistent with existing canvas-based rendering

**Approach 2: HTML Overlay**
- Create HTML element overlay on top of canvas
- Use CSS for styling and positioning
- Easier to style and position text
- Anomaly with canvas-based rendering approach

**Decision**: Approach 1 (Canvas-Based Overlay)

**Rationale**:
- Consistent with existing rendering architecture (grid, snake, food all render on canvas)
- No new rendering technology to introduce
- Simpler overall architecture (single canvas context)
- Follows project's vanilla JavaScript approach
- Semi-transparent overlay is straightforward with canvas globalAlpha

**Alternatives Considered**:
- HTML Overlay: Rejected as introduces inconsistent rendering technology

---

### 6. Automatic Restart Timing

**Question**: How to implement the 1-2 second automatic restart?

**Findings**:

**Approach 1: setTimeout on Game Over**
- Call `setTimeout(() => restartGame(), 1500)` when collision detected
- Simple timing mechanism
- Standard JavaScript API

**Approach 2: Track Game-Over Timestamp**
- Store `gameOverTimestamp` in state
- Check elapsed time in game loop
- More complex but more testable
- Integrates with game loop timing

**Decision**: Approach 1 (setTimeout on Game Over)

**Rationale**:
- Simpler implementation
- Clear separation of concerns: collision handling triggers restart timer
- Standard JavaScript timing API
- No need to pollute game loop with timing logic
- Testable by mocking setTimeout in tests
- Easier to understand intent: "game over → wait → restart"

**Alternatives Considered**:
- Timestamp-based: Rejected as more complex without clear benefit for simple restart timing

---

### 7. Collision vs Food Timing

**Question**: What if snake head moves to position with both collision (boundary/self) and food?

**Findings**: From spec edge cases:
- "What happens when a collision occurs exactly as the snake consumes food in the same tick? The collision takes precedence and the game ends immediately (food consumption and growth do not occur)."

**Decision**: Collision takes precedence over food consumption

**Rationale**:
- Explicitly defined in spec edge cases
- Conservative approach: game ends before any beneficial action
- Clear priority: survival (collision check) before benefit (food check)
- Follows game design principle: fail-fast for challenge

**Implementation Order**:
1. Move snake to new position
2. Check collision (boundary, then self)
3. If collision: end game → show overlay → restart
4. Else: check food → consume ifpresent
5. Render

---

## Implementation Approach Summary

1. **Collision Detection Module**: New `collision/` directory with:
   - `collision-types.ts`: Type definitions for collision state
   - `collision-detector.ts`: Boundary and self-collision detection functions
   - `game-over-overlay.ts`: Canvas-based overlay rendering

2. **Boundary Detection**: `isPositionWithinBounds(position, gridBounds)` function

3. **Self-Collision Detection**: Linear search through body segments

4. **Game State Extension**: Add `gameStatus` field with 'playing' | 'game-over' values

5. **Overlay Rendering**: Canvas-based semi-transparent overlay with "You crashed" text

6. **Automatic Restart**: setTimeout with 1.5 seconds (middle of 1-2 second requirement)

7. **Game Loop Integration**: Collision check before food check, before render

8. **Testing**: Acceptance tests for each collision scenario, unit tests for detection logic

---

## Technical Decisions Made

| Decision Point | Choice | Reason |
|---------------|--------|--------|
| Collision timing | After movement (reactive) | Simpler, aligned with spec language |
| Boundary detection | Bounding box function | More readable, testable, reusable |
| Self-collision detection | Linear search | Sufficient for typical snake lengths |
| Game state management | Add gameStatus enum | Clear state transitions, extensible |
| Overlay rendering | Canvas-based | Consistent with existing architecture |
| Restart timing | setTimeout | Simpler, clear separation of concerns |
| Collision vs food priority | Collision first | Explicit in spec, fail-fast principle |

---

## Open Items

**None** - All technical questions resolved.