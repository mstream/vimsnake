# Tasks: Snake Movement Control

**Input**: Design documents from `/specs/002-snake-control/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Acceptance tests included per constitution (User Acceptance Test Priority principle)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths use existing structure established by feature 001-grid-rendering

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create module structure and type definitions shared across all user stories

- [X] T001 Create directory structure for snake module at `src/snake/`
- [X] T002 Create directory structure for game module at `src/game/`
- [X] T003 Create directory structure for snake unit tests at `tests/unit/snake/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and constants that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Define MovementDirection and GridPosition types in `src/snake/snake-types.ts`
- [X] T005 [P] Define SnakeBody and SnakeState types in `src/snake/snake-types.ts`
- [X] T006 [P] Define direction vectors constant in `src/snake/snake-constants.ts`
- [X] T007 [P] Define opposite directions map in `src/snake/snake-constants.ts`
- [X] T008 [P] Define VIM key-to-direction mapping in `src/snake/snake-constants.ts`
- [X] T009 [P] Define initial snake configuration constants in `src/snake/snake-constants.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Basic Continuous Movement (Priority: P1) 🎯 MVP

**Goal**: Snake moves automatically at1 grid cell per second without user input

**Independent Test**: Start game, wait 3 seconds without keys, verify snake moved 3 cells downward

### Acceptance Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Create acceptance test file at `tests/acceptance/snake-movement.spec.ts`
- [X] T011 [P] [US1] Write acceptance test: snake appears on grid at center position
- [X] T012 [P] [US1] Write acceptance test: snake moves 1 cell per second automatically
- [X] T013 [P] [US1] Write acceptance test: snake has 3 cells arranged vertically (head at center, body above)

### Implementation for User Story 1

- [X] T014 [US1] Implement createInitialSnakeState function in `src/snake/snake-state.ts`
- [X] T015 [US1] Implement calculateNextHeadPosition function in `src/snake/snake-state.ts`
- [X] T016 [US1] Implement moveSnake function in `src/snake/snake-state.ts`
- [X] T017 [US1] Initialize canvas rendering context for snake in `src/snake/snake-renderer.ts`
- [X] T018 [US1] Implement renderSnake function in `src/snake/snake-renderer.ts`
- [X] T019 [US1] Initialize game loop tick interval (1000ms) in `src/game/game-loop.ts`
- [X] T020 [US1] Implement executeMovementTick function in `src/game/game-loop.ts`
- [X] T021 [US1] Initialize snake renderer and game loop in `src/main.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional - snake moves continuously

---

## Phase 4: User Story 2 - Direction Change with VIM Keys (Priority: P1)

**Goal**: Player can change snake direction using h/j/k/l keys

**Independent Test**: Press 'h' while snake moving down, verify snake turns left on next tick

### Acceptance Tests for User Story 2

- [X] T022 [P] [US2] Write acceptance test: pressing 'h' turns snake left
- [X] T023 [P] [US2] Write acceptance test: pressing 'j' turns snake down
- [X] T024 [P] [US2] Write acceptance test: pressing 'k' turns snake up
- [X] T025 [P] [US2] Write acceptance test: pressing 'l' turns snake right

### Implementation for User Story 2

- [X] T026 [US2] Initialize keyboard input listener in `src/snake/keyboard-input.ts`
- [X] T027 [US2] Implement handleKeyDown function with key mapping in `src/snake/keyboard-input.ts`
- [X] T028 [US2] Implement getCurrentSnakeState function in `src/snake/keyboard-input.ts`
- [X] T029 [US2] Implement updateSnakeState function in `src/snake/keyboard-input.ts`
- [X] T030 [US2] Call initializeKeyboardInput in game loop initialization in `src/game/game-loop.ts`

**Checkpoint**: At this point, User Story 2 should work - player can steer with h/j/k/l

---

## Phase 5: User Story 3 - Directional Constraint (Priority: P1)

**Goal**: Game prevents direction reversal (no 180-degree turns)

**Independent Test**: While snake moving down, press 'k' (up), verify snake continues moving down

### Acceptance Tests for User Story 3

- [X] T031 [P] [US3] Write acceptance test: pressing opposite direction while moving down is ignored
- [X] T032 [P] [US3] Write acceptance test: pressing opposite direction while moving up is ignored
- [X] T033 [P] [US3] Write acceptance test: pressing opposite direction while moving left is ignored
- [X] T034 [P] [US3] Write acceptance test: pressing opposite direction while moving right is ignored
- [X] T035 [P] [US3] Write acceptance test: holding a direction key continuously has no effect (FR-012)

### Implementation for User Story 3

- [X] T036 [US3] Implement isDirectionReversal function in `src/snake/snake-state.ts`
- [X] T037 [US3] Update handleKeyDown to check for direction reversal in `src/snake/keyboard-input.ts`

**Checkpoint**: At this point, User Story 3 should work - reversals are prevented

---

## Phase 6: User Story 4 - Single Direction Queue (Priority: P2)

**Goal**: Only the most recent direction input is queued per movement tick

**Independent Test**: Press 'h' then 'j' within same tick, verify only 'j' takes effect

### Acceptance Tests for User Story 4

- [X] T038 [P] [US4] Write acceptance test: multiple key presses in same tick applies only last valid direction
- [X] T039 [P] [US4] Write acceptance test: pressing same direction twice queues correctly
- [X] T040 [P] [US4] Write acceptance test: direction changes take effect within 100ms (SC-001)

### Implementation for User Story 4

- [X] T041 [US4] Add pendingDirection field handling in `src/snake/snake-state.ts`
- [X] T042 [US4] Implement queueDirectionChange function in `src/snake/snake-state.ts`
- [X] T043 [US4] Implement applyPendingDirection function in `src/snake/snake-state.ts`
- [X] T044 [US4] Update handleKeyDown to use queueDirectionChange in `src/snake/keyboard-input.ts`
- [X] T045 [US4] Call applyPendingDirection at start of movement tick in `src/game/game-loop.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Unit tests and final integration

- [X] T046 [P] Write unit tests for snake-state functions (including movement logic) in `tests/unit/snake/snake-state.spec.ts`
- [X] T047 [P] Write unit tests for keyboard input handling in `tests/unit/snake/keyboard-input.spec.ts`
- [X] T048 Write timing variance test: verify movement rate within 5% of 1 cell/second (SC-002)
- [X] T049 Run full test suite: `npm test` (vitest + playwright)
- [X] T050 Run lint check: `npm run lint`
- [X] T051 Validate implementation matches quickstart.md scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Foundational
  - US2 (P1): Depends on US1 (needs snake state and movement)
  - US3 (P1): Depends on US2 (needs keyboard input)
  - US4 (P2): Depends on US2 (needs keyboard input)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (needs snake state to modify direction)
- **User Story 3 (P1)**: Depends on US2 (needs keyboard input to validate)
- **User Story 4 (P2)**: Depends on US2 (needs keyboard input queue)

### Within Each User Story

- Acceptance tests MUST be written and FAIL before implementation
- Types/constants before functions
- Functions before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks can run in parallel (T001, T002, T003)
- All Foundational type/constant tasks can run in parallel (T004-T009)
- All acceptance tests within a story can run in parallel (all marked [P])
- Unit tests in Polish phase can run in parallel (T046, T047)

---

## Parallel Example: Foundational Phase

```bash
# Launch all type definitions in parallel:
Task: "Define MovementDirection and GridPosition types in src/snake/snake-types.ts"
Task: "Define SnakeBody and SnakeState types in src/snake/snake-types.ts"

# Launch all constants in parallel:
Task: "Define direction vectors constant in src/snake/snake-constants.ts"
Task: "Define opposite directions map in src/snake/snake-constants.ts"
Task: "Define VIM key-to-direction mapping in src/snake/snake-constants.ts"
Task: "Define initial snake configuration constants in src/snake/snake-constants.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (continuous movement)
4. **STOP and VALIDATE**: Test US1 independently - snake moves automatically
5. Deploy/demo if ready - playable game with auto-moving snake

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (snake moves!) 
3. Add User Story 2 → Test independently → Deploy/Demo (player can steer!)
4. Add User Story 3 → Test independently → Deploy/Demo (no more accidental reversals!)
5. Add User Story 4 → Test independently → Deploy/Demo (predictable controls!)
6. Each story adds value without breaking previous stories

### Test-Driven Development

Per constitution (Principle VI: User Acceptance Test Priority):

1. Write acceptance tests for each story FIRST
2. Verify tests FAIL (feature not implemented)
3. Implement minimum code to pass tests
4. Verify tests PASS
5. Move to next story

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Acceptance tests use Playwright per existing project structure
- Unit tests use Vitest per existing project structure
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently