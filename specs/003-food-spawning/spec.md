# Feature Specification: Food Spawning

**Feature Branch**: `003-food-spawning`  
**Created**: 2026-03-18  
**Status**: Draft  
**Input**: User description: "food spawning - make food appear randomly on the grid. It should not appear in cells where snake body is at and also should not appear in any adjacent to snake cells. There food should occupy only one cell and there should be only one at a time. Once a snake's body moves onto the cell that food is at, the food disappears, snake grows by one segment and a new food appears in a random place."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initial Food Placement (Priority: P1)

At the start of the game, players need food to appear on the grid so they can begin playing. The food must be placed in a valid location away from the snake's initial position and its immediate surroundings to give players a fair starting point.

**Why this priority**: Without initial food, the game cannot start. This is the core foundation for the entire feature.

**Independent Test**: Can be fully tested by starting a new game and verifying that food appears on the grid in a valid location (not on or adjacent to the snake). Delivers immediate playable game state.

**Acceptance Scenarios**:

1. **Given** a new game has started, **When** the game initializes, **Then** exactly one food item appears on the grid
2. **Given** a new game has started, **When** food is placed, **Then** the food is not positioned on any cell occupied by the snake's body
3. **Given** a new game has started, **When** food is placed, **Then** the food is not positioned in any cell adjacent to the snake's body (including diagonally adjacent cells)
4. **Given** a new game has started, **When** food is placed, **Then** the food occupies exactly one grid cell

---

### User Story 2 - Food Consumption and Growth (Priority: P1)

During gameplay, when players move the snake onto a cell containing food, the food should disappear, the snake should grow by one segment, and a new food item should appear in a valid random location. Players need this feedback to understand their progress and continue playing.

**Why this priority**: This is the core game loop action that drives gameplay and scoring. Essential for game progression.

**Independent Test**: Can be fully tested by moving the snake to consume food and verifying the snake grows and new food appears. Delivers complete food cycle interaction.

**Acceptance Scenarios**:

1. **Given** food exists on the grid and the snake moves, **When** the snake's head moves onto the cell containing food, **Then** the food disappears from that cell
2. **Given** the snake moves onto food, **When** the food is consumed, **Then** the snake's body grows by exactly one segment
3. **Given** food is consumed, **When** food disappears from the grid, **Then** exactly one new food item appears in a random valid location
4. **Given** food is consumed, **When** new food appears, **Then** the new food placement follows the same placement rules (not on snake body, not adjacent to snake body)

---

### User Story 3 - Continuous Random Food Placement (Priority: P2)

Throughout gameplay, players expect each new food item to appear in a random valid location to keep the game challenging and fair. The randomness should ensure varied gameplay experiences across multiple game sessions.

**Why this priority**: Enhances replayability and fairness, but the core eating mechanic can function without randomness variety.

**Independent Test**: Can be fully tested by consuming multiple food items and verifying that food appears in different valid locations over time. Delivers varied gameplay experience.

**Acceptance Scenarios**:

1. **Given** food is consumed multiple times in a game session, **When** each new food appears, **Then** the location is selected randomly from all valid cells
2. **Given** the snake grows longer during gameplay, **When** new food is placed, **Then** the valid cell pool shrinks proportionally to available non-snake, non-adjacent cells
3. **Given** multiple games are played, **When** comparing initial food placements across games, **Then** the positions vary, demonstrating randomness

---

### Edge Cases

- What happens when the snake occupies most of the grid and there are insufficient valid cells for food placement?
- How does the system handle food placement when the snake is at grid boundaries (adjacent cells may be outside the grid)?
- What happens when the snake consumes food and there are zero valid cells for new food placement?
- How does the system ensure food doesn't repeatedly appear in the same or similar locations (avoiding patterns)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST place exactly one food item on the grid at game start
- **FR-002**: System MUST ensure food is placed only on cells that are not occupied by the snake's body
- **FR-003**: System MUST ensure food is placed only on cells that are not adjacent to any part of the snake's body (adjacency includes all eight surrounding cells: north, south, east, west, and four diagonals)
- **FR-004**: System MUST remove food from the grid when the snake's head moves onto the food's cell
- **FR-005**: System MUST increase the snake's length by exactly one segment when food is consumed
- **FR-006**: System MUST place a new food item immediately after consumption with the same placement rules
- **FR-007**: System MUST select food locations randomly from all valid available cells
- **FR-008**: System MUST ensure food occupies exactly one grid cell at all times
- **FR-009**: System MUST maintain exactly one food item on the grid at any given time (no zero or multiple food items)
- **FR-010**: System MUST stop placing new food when insufficient valid cells exist (all available cells are occupied by the snake or adjacent to the snake body)

### Key Entities

- **Food**: A single-cell game element that appears at random valid grid locations. Represents the objective for the snake to consume. Occupies exactly one cell and cannot overlap with the snake or its adjacent cells.
- **Grid Cell**: A single position on the game board that can be empty, contain food, or contain a snake segment. Adjacent cells include all eight surrounding positions (orthogonal and diagonal).
- **Snake Segment**: A single cell occupied by the snake's body. The snake consists of multiple connected segments. Food cannot be placed on any segment or in cells adjacent to any segment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can see food on the grid at game start within 1 second of game initialization
- **SC-002**: Food consumption and regeneration completes in under 100 milliseconds, providing smooth gameplay
- **SC-003**: Food never appears on or adjacent to the snake body in 100% of observed placements
- **SC-004**: Snake grows by exactly one segment immediately upon consuming food in 100% of observed consumptions
- **SC-005**: New food appears within 100 milliseconds after consumption
- **SC-006**: Food placement demonstrates randomness across multiple game sessions with no predictable patterns
- **SC-007**: Game maintains exactly one food item on the grid at all times during normal gameplay
- **SC-008**: Edge case handling (insufficient valid cells) is graceful with clear behavior that doesn't crash or freeze the game