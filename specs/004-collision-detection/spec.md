# Feature Specification: Collision Detection

**Feature Branch**: `004-collision-detection`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "collision detection - I would like the snake to crash on grid boundaries and on elements of its own body. When snake collides with those."

## Clarifications

### Session 2026-03-19

- Q: How should the player restart the game after a collision ends it? → A: Automatic after delay
- Q: What visual indication should show when the game ends due to collision? → A: Full screen overlay
- Q: How long should the delay be before the game automatically restarts after a collision? → A: 1-2 seconds
- Q: What text should appear on the game-over overlay? → A: "You crashed"
- Q: Should the game-over overlay be semi-transparent or fully opaque? → A: Semi-transparent

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Grid Boundary Collision (Priority: P1)

As a player, when I steer the snake into the edge of the game grid, the game should end immediately. This prevents the snake from moving outside the visible play area and establishes clear game boundaries that define where I can and cannot navigate.

**Why this priority**: Grid boundary collision is a fundamental game rule. Without it, the snake could move off-screen, making the game unplayable and breaking the core gameplay loop. This must work before the game can be considered complete.

**Independent Test**: Can be fully tested by steering the snake toward any grid boundary and verifying the game ends when the snake head reaches the boundary edge. Delivers complete boundary protection behavior.

**Acceptance Scenarios**:

1. **Given** the snake is moving right near the right grid boundary, **When** the snake's head reaches column 31 (the last column), **Then** the game ends immediately and the snake does not move to column 32 or beyond
2. **Given** the snake is moving left near the left grid boundary, **When** the snake's head reaches column 0, **Then** the game ends immediately and the snake does not move to column -1 or beyond
3. **Given** the snake is moving up near the top grid boundary, **When** the snake's head reaches row 0, **Then** the game ends immediately and the snake does not move to row -1 or beyond
4. **Given** the snake is moving down near the bottom grid boundary, **When** the snake's head reaches row 31 (the last row), **Then** the game ends immediately and the snake does not move to row 32 or beyond

---

### User Story 2 - Self Collision (Priority: P1)

As a player, when the snake's head moves into a grid cell already occupied by its own body, the game should end immediately. This creates the core challenge of the game, requiring me to carefully navigate without crossing my own path as the snake grows longer.

**Why this priority**: Self-collision is the primary challenge mechanic in snake games. Without it, the game lacks risk and strategy. Players must be able to crash into their own body for the game to function as intended.

**Independent Test**: Can be fully tested by steering the snake in a path that causes its head to intersect with its body and verifying the game ends immediately upon collision. Delivers complete self-collision protection behavior.

**Acceptance Scenarios**:

1. **Given** the snake has length 4 or more, **When** the player steers the snake's head into a cell occupied by any segment of its own body, **Then** the game ends immediately
2. **Given** the snake is moving and growing longer, **When** the snake's head collides with any body segment (including segments that were just the tail in the previous move), **Then** the game ends immediately
3. **Given** the snake makes a sharp turn creating a tight space, **When** the player steers the head back toward the body, **Then** collision is detected the moment the head overlaps with any body segment

---

### User Story 3 - Game Ending State (Priority: P2)

As a player, when a collision occurs (boundary or self), I want the game to stop immediately and enter an end state. After a brief delay, the game should automatically restart so I can quickly try again. This provides closure on the current game session and allows me to play again without manual intervention.

**Why this priority**: While collision detection itself is critical (P1), the specific visual handling and restart mechanism enhances user experience but the core collision behavior is what matters most for gameplay integrity.

**Independent Test**: Can be fully tested by triggering any collision and verifying the game stops, displays an end state, and allows the player to restart. Delivers complete game cycle experience.

**Acceptance Scenarios**:

1. **Given** any collision has occurred, **When** the game ends, **Then** the snake stops moving immediately (no further ticks or movement)
2. **Given** the game has ended from collision, **When** the player observes the game state, **Then** the game displays a semi-transparent full screen overlay with the text "You crashed" while the final snake position remains visible
3. **Given** the game has ended from collision, **When** 1-2 seconds pass, **Then** the game automatically restarts with the snake reset to its initial state and ready to play

---

### Edge Cases

- What happens when a collision occurs exactly as the snake consumes food in the same tick? The collision takes precedence and the game ends immediately (food consumption and growth do not occur).
- How does the system handle collision detection when the snake is exactly at length 3 (minimum possible self-collision is impossible until length 4)? Collision detection still runs but self-collision cannot occur until the snake grows to length 4 or more.
- What happens if the snake somehow occupies the entire grid? While unlikely, if this occurs, any movement would result in immediate self-collision (the snake cannot move without hitting itself).
- How does collision detection work at the exact moment the snake grows? The head moves into a new cell first, then growth occurs. If the new head position collides with existing body, collision is detected before growth.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST detect and end game when the snake's head position would be outside valid grid boundaries (columns 0-31, rows 0-31), preventing movement beyond the visible play area
- **FR-002**: System MUST detect and end game when the snake's head position overlaps with any body segment (excluding the head segment itself)
- **FR-003**: System MUST check for both boundary and self collisions on every movement tick
- **FR-004**: System MUST stop all snake movement immediately upon detecting any collision
- **FR-005**: System MUST display a semi-transparent full screen overlay with the text "You crashed" when the game ends due to collision, allowing the final snake position to remain visible
- **FR-006**: System MUST automatically restart the game after 1-2 seconds following a collision
- **FR-007**: System MUST reset all game state (snake position, direction, length, food position) during automatic restart after collision

### Key Entities

- **Collision Zone**: A grid boundary edge (top row 0, bottom row 31, left column 0, right column 31) or any cell occupied by the snake's body segments. The snake head cannot enter these zones without triggering game end.
- **Snake Head**: The leading segment of the snake that determines collision. When the head's next position would be outside grid boundaries or on a body cell, collision is triggered.
- **Snake Body Segments**: All grid cells occupied by the snake except the head. These cells constitute collision zones that the head must avoid.
- **Game End State**: The state entered when any collision is detected. Characterized by stopped snake movement, a brief pause to display the game-over state, and automatic restart after the delay.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Snake collision with any grid boundary is detected and game ends within 1 movement tick (immediate detection)
- **SC-002**: Snake collision with its own body is detected and game ends within 1 movement tick (immediate detection)
- **SC-003**: Players cannot move the snake outside the visible grid boundaries (100% of boundary violation attempts result in game end)
- **SC-004**: Players cannot navigate the snake's head through its own body (100% of self-intersection attempts result in game end)
- **SC-005**: Game stops all movement immediately upon collision with no additional movements or ticks after collision
- **SC-006**: Game automatically restarts within 1-2 seconds after collision, resetting to initial state (snake at center, length 3, moving down)
- **SC-007**: Collision detection has no noticeable impact on game performance (detection completes within the 1-second movement tick)
- **SC-008**: Players observe game-over overlay within 1 movement tick after collision detection in 100% of test cases, with clear visual feedback showing collision location (final snake position visible through semi-transparent overlay)