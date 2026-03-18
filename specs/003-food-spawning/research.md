# Research: Food Spawning

**Feature**: 003-food-spawning  
**Date**: 2026-03-18  
**Purpose**: Resolve technical questions and establish implementation approach

## Research Tasks

### 1. Random Position Generation in Grid-Based Games

**Question**: What is the best approach for generating random valid positions for food in a grid-based snake game?

**Findings**:

**Approach 1: Rejection Sampling**
- Generate random positions until finding a valid one
- Simple to implement
- Performance degrades as grid fills up
- Works well for sparse grids (typical snake game scenario)

**Approach 2: Pool-Based Selection**
- Maintain a list of all valid positions
- Select randomly from the pool
- More performant for dense grids
- Requires rebuilding the pool when state changes

**Decision**: Pool-based selection

**Rationale**: 
- Snake game grids typically have significant occupation (snake body + adjacency exclusion)
- Pool-based is more predictable in performance
- Easier to detect "no valid cells" edge case
- Aligns with constitution's self-documenting code principle (clear intent: "select from valid positions")

**Alternatives Considered**:
- Rejection sampling: Rejected due to unpredictable performance when grid is nearly full

---

### 2. Adjacency Calculation for Grid Positions

**Question**: How to efficiently calculate which cells are adjacent to the snake body (8-way adjacency)?

**Findings**:

**Approach 1: For Each Snake Segment, Mark Adjacent Cells**
- Iterate through snake body
- For each segment, mark all 8 surrounding cells as invalid
- Time complexity: O(snake_length)
- Simple andclear

**Approach 2: Maintain Invalidation Set**
- Keep a set of invalid positions updated on each snake move
- More complex state management
- Better for multiple lookups

**Decision**: Approach 1 (For Each Snake Segment)

**Rationale**:
- Snake games typically have limited length (won't reach hundreds of segments)
- Recalculating on each food spawn is simpler and clearer
- No hidden state to manage
- Aligns with constitution's self-documenting code principle (no hidden state)

**Alternatives Considered**:
- Invalidation set: Rejected due to additional state management complexity without clear benefit for typical snake game scenarios

---

### 3. Snake Growth Mechanics

**Question**: How should snake growth be implemented when food is consumed?

**Findings**:

**Approach 1: Don't Remove Tail on Next Move**
- When food is consumed, skip the tail removal step in the move function
- Snake naturally grows by one segment
- Clean implementation

**Approach 2: Append Segment to Tail**
- Add a new segment to the tail when food is consumed
- Requires tracking where the tail was
- More complex

**Decision**: Approach 1 (Skip Tail Removal)

**Rationale**:
- Integrates naturally with existing move logic
- No extra state to track
- Clear intent in code: "isGrowing" flag controls whether tail is removed
- Matches the existing `moveSnake` function pattern

**Alternatives Considered**:
- Append to tail: Rejected as more complex without benefit

---

### 4. Game State Management Pattern

**Question**: Where should food state be integrated in the game state hierarchy?

**Findings**:

**Current Game State Structure**:
```
Game State
├── Snake State (body, direction)
├── Grid State (constants, rendering metrics)
└── Game Loop (timing, update/render)
```

**Proposed Addition**:
```
Game State
├── Snake State (body, direction)
├── Food State (position, existence flag)    [NEW]
├── Grid State (constants, rendering metrics)
└── Game Loop (timing, update/render)
```

**Decision**: Add Food State as a peer to Snake State

**Rationale**:
- Food is a separate game entity with its own state
- Follows existing pattern from `snake-state.ts`
- Clear separation of concerns
- Makes state management explicit and self-documenting

**Alternatives Considered**:
- Integrate into Snake State: Rejected because food is not part of the snake entity
- Integrate into Game Loop: Rejected because state should be separate from loop logic

---

### 5. Cross-Browser Random Number Generation

**Question**: What random number generation approach works across all browsers?

**Findings**:

**Approach 1: Math.random()**
- Built-in JavaScript
- Works in all browsers
- Sufficient non-cryptographic randomness for games
- No dependencies

**Approach 2: Crypto.getRandomValues()**
- Cryptographically secure
- More complex to use
- Unnecessary for game mechanics

**Decision**: Math.random()

**Rationale**:
- Standard JavaScript API
- Available in all browsers
- Sufficient entropy for game randomization
- Aligns with project's vanilla JavaScript approach

**Alternatives Considered**:
- Crypto API: Rejected as over-engineering for a game's random food placement

---

## Implementation Approach Summary

1. **Food State Module**: New `food/` directory with:
   - `food-types.ts`: Type definitions for food position
   - `food-constants.ts`: Constants (if needed)
   - `food-state.ts`: State management functions
   - `food-spawner.ts`: Placement logic

2. **Adjacency Calculation**: Function to calculate invalid cells (snake body + 8-way adjacency)

3. **Random Position Selection**: Pool-based selection from valid cells

4. **Snake Growth**: Flag in game state to skip tail removal on next move

5. **State Integration**: Food state as peer module to snake state

6. **Testing**: Acceptance tests prioritize user workflows, unit tests for edge cases

---

## Technical Decisions Made

| Decision Point | Choice | Reason |
|---------------|--------|--------|
| Random position generation | Pool-based selection | Predictable performance, easy edge case detection |
| Adjacency calculation | Calculate on spawn | Simple, no hidden state |
| Snake growth | Skip tail removal | Natural integration with existing move logic |
| State structure | New food state module | Clear separation, follow existing patterns |
| Random number generation | Math.random() | Standard, sufficient for games |

---

## Open Items

**None** - All technical questions resolved.