# Feature Specification: Snake Movement Control

**Feature Branch**: `002-snake-control`  
**Created**: 2026-03-14  
**Status**: Draft  
**Input**: User description: "controling snake - a user should be able to control a snake. Snake should be 3 cells long and in a constant move of 1 grid cell a second. If no control keys are being pressed, it should keep moving in its original direction. A user can make it make a 90 degree turn by pressing a direction key. The key mapping for controlling a snake has to be the same as default keys for controlling a cursor in the VIM text editor. That means: j - down, k - up, h - left and l - right. So for example: if a snake current moving direction is to the left, user can make it move upwards by pressing k or downwards by pressing j but they cannot make it move right (that would be only possible by turning snake in the same direction twice)."

## Clarifications

### Session 2026-03-14

- Q: What direction should the snake be moving when the game starts? → A: Down
- Q: Where on the grid should the snake spawn when the game starts? → A: Center of grid
- Q: What is the maximum number of direction changes that can be queued at once? → A: 1 input only (queue resets each tick)
- Q: How are the 3 cells of the snake arranged at game start? → A: Vertical: head at center facing down, 2 body cells above head
- Q: What happens when a player holds down a direction key? → A: Auto-repeat - while held, direction re-registered each tick (no effect since direction unchanged)

### Session 2026-03-15

- Q: When does the snake actually change direction relative to the movement tick? → A: At START of tick: Apply pending direction first → Then move snake. Player sees new direction applied immediately on next visible movement.
- Q: How should the keyboard input's pending direction be communicated to the game loop for the next tick? → A: Pull pattern: Game loop reads keyboard input's current state at start of each tick (uses getCurrentSnakeState)
- Q: When the game loop renders the snake after each tick, which state should be rendered? → A: AFTER tick: Apply direction, move snake, then render (player sees final state after tick completes)
- Q: When a player presses a direction key and there's already a pending direction queued, should reversal be checked against CURRENT direction or PENDING direction? → A: Check reversal against PENDING direction if one exists, otherwise CURRENT direction. Allows more responsive queuing of valid turn sequences.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Continuous Movement (Priority: P1)

As a player, I want the snake to move continuously on its own so that I can focus on steering rather than propelling it forward.

**Why this priority**: This is the foundational mechanic - without continuous movement, the snake game cannot function. All other features depend on this working first.

**Independent Test**: Can be fully tested by starting a new game and observing the snake moving automatically without any user input, delivering the core gameplay loop.

**Acceptance Scenarios**:

1. **Given** a game has started with a 3-cell snake, **When** no keys are pressed for 3 seconds, **Then** the snake moves forward 3 grid cells in its initial direction (1 cell per second)
2. **Given** the snake is moving, **When** the game is running, **Then** the snake moves exactly 1 grid cell per second at a consistent pace

---

### User Story 2 - Direction Change with VIM Keys (Priority: P1)

As a player familiar with VIM, I want to control the snake using h, j, k, l keys so that I can steer the snake intuitively with familiar controls.

**Why this priority**: This is equally foundational to P1-1 - control input is essential for gameplay. Together with continuous movement, these form the minimum viable snake game.

**Independent Test**: Can be fully tested by pressing direction keys and observing the snake turn, delivering interactive control over the game.

**Acceptance Scenarios**:

1. **Given** the snake is moving upward, **When** the player presses 'h' (left), **Then** the snake turns 90 degrees left on its next movement
2. **Given** the snake is moving upward, **When** the player presses 'l' (right), **Then** the snake turns 90 degrees right on its next movement
3. **Given** the snake is moving left, **When** the player presses 'k' (up), **Then** the snake turns upward on its next movement

---

### User Story 3 - Directional Constraint (Priority: P1)

As a player, I want the game to prevent me from reversing the snake's direction so that I cannot accidentally crash into my own body by pressing a backward key.

**Why this priority**: This is essential for game fairness - without it, players could accidentally end their game immediately. It's part of the core gameplay mechanics.

**Independent Test**: Can be fully tested by attempting to press the opposite direction key and verifying the snake continues in its current direction, delivering fair gameplay mechanics.

**Acceptance Scenarios**:

1. **Given** the snake is moving right, **When** the player presses 'h' (left), **Then** the snake continues moving right (the input is ignored)
2. **Given** the snake is moving down, **When** the player presses 'k' (up), **Then** the snake continues moving down (the input is ignored)
3. **Given** the snake is moving left, **When** the player presses 'l' (right), **Then** the snake continues moving left (the input is ignored)
4. **Given** the snake is moving up, **When** the player presses 'j' (down), **Then** the snake continues moving up (the input is ignored)

---

### User Story 4 - Single Direction Queue (Priority: P2)

As a player, I want only my most recent direction input to be queued so that the controls remain predictable and I don't accidentally execute turns I no longer intend.

**Why this priority**: This improves control predictability but the game is playable without explicit documentation of this behavior. Basic directional control (P1 stories) is sufficient for MVP.

**Independent Test**: Can be tested by pressing multiple direction keys within a single second and verifying only the last valid input takes effect.

**Acceptance Scenarios**:

1. **Given** the snake is moving up, **When** the player presses 'h' then 'j' within 1 second (same movement tick), **Then** the snake turns down (only the last input is applied)
2. **Given** the snake is moving right, **When** the player presses 'k' then 'h' within 0.5 seconds, **Then** the snake turns left (only the last valid input is applied)

---

### Edge Cases

- What happens when a player holds down a direction key? While held, the direction is re-registered each tick (has no effect since direction unchanged)
- What happens when multiple valid directions are pressed within a single movement tick? Only the last valid direction input is queued and applied on the next tick
- What happens when the snake reaches the grid boundary while turning? The snake continues following movement rules and would exit the visible area (collision handling is a separate feature)
- What happens if conflicting keys are pressed simultaneously (e.g., h and l at same time)? The game processes keys in order of arrival; last valid direction takes effect

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The snake MUST start with a length of exactly 3 grid cells arranged vertically with the head at the grid center facing down and 2 body cells extending upward, moving downward at game initialization
- **FR-002**: The snake MUST move continuously at a rate of exactly 1 grid cell per second
- **FR-003**: The snake MUST continue moving in its current direction when no control keys are pressed
- **FR-004**: The game MUST recognize 'h' key as the command to turn left
- **FR-005**: The game MUST recognize 'j' key as the command to turn down
- **FR-006**: The game MUST recognize 'k' key as the command to turn up
- **FR-007**: The game MUST recognize 'l' key as the command to turn right
- **FR-008**: The snake MUST only accept 90-degree direction changes (no 180-degree reversals)
- **FR-009**: The game MUST ignore direction inputs that would cause an immediate 180-degree turn
- **FR-010**: Direction changes MUST take effect on the next movement tick (not mid-tick)
- **FR-011**: Only one direction input can be queued at a time; if multiple inputs occur within a movement tick, only the last valid input is applied
- **FR-012**: When a direction key is held down, the direction is re-registered each tick but has no effect (direction remains unchanged)

### Key Entities

- **Snake**: The player-controlled entity consisting of connected grid cells. Has a current direction of movement (up, down, left, right) - starts moving downward from the center of the grid with head at center and 2 body cells extending upward - and a length (starting at 3 cells). Occupies specific grid positions.
- **Grid Cell**: A single position on the game board. Each cell can be empty or occupied by part of the snake. Has x and y coordinates.
- **Movement Direction**: One of four possible directions: up, down, left, or right. Cannot reverse to the opposite direction directly.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can change the snake's direction within 100ms of pressing a valid key, creating a responsive feel
- **SC-002**: The snake moves at exactly 1 grid cell per second with no more than 5% timing variance
- **SC-003**: Direction reversal attempts are 100% prevented - no accidental self-collision from pressing the opposite direction
- **SC-004**: Players familiar with VIM can successfully control the snake on their first attempt without learning new key bindings
- **SC-005**: When multiple direction keys are pressed within a single movement tick, only the last valid input is queued and applied