# Tasks: Collision Detection

**Input**: Design documents from `/specs/004-collision-detection/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Acceptance tests are required per constitution (Section VI: User Acceptance Test Priority). Unit tests are optional but recommended for complex logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root
- Paths follow existing vimsnake structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create collision module structure and extend game types

- [X] T001 Create collision module directory structure in src/collision/
- [X] T002 [P] Create collision-types.ts in src/collision/collision-types.ts with GameStatus, CollisionType, GridBounds, and CollisionResult types
- [X] T003 [P] Extend game-types.ts in src/game/game-types.ts to add gameStatus field to GameState interface

**Checkpoint**: Module structure and types ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core collision detection functions AND game-ending logic that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create collision-detector.ts in src/collision/collision-detector.ts
- [X] T005 Implement getGridBounds function in src/collision/collision-detector.ts using existing grid constants
- [X] T006 [P] Implement isPositionWithinBounds function in src/collision/collision-detector.ts for bounds validation
- [X] T007 [P] Implement hasBoundaryCollision function in src/collision/collision-detector.ts for boundary collision detection
- [X] T008 Implement hasSelfCollision function in src/collision/collision-detector.ts for self-collision detection (must skip head segment)
- [X] T009 Implement detectCollision function in src/collision/collision-detector.ts that checks boundary first then self collision
- [X] T009a Integrate collision detection into game loop in src/game/game-loop.ts - check collision after snake movement and set gameStatus='game-over' if collision detected

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Grid Boundary Collision (Priority: P1) 🎯 MVP

**Goal**: Detect when snake head moves outside grid boundaries and end game immediately

**Independent Test**: Steer snake toward any grid boundary and verify game ends when head reaches boundary edge

### Tests for User Story 1

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [X] T010 [P] [US1] Create acceptance test for right boundary collision in tests/acceptance/collision-detection.spec.ts
- [X] T011 [P] [US1] Create acceptance test for left boundary collision in tests/acceptance/collision-detection.spec.ts
- [X] T012 [P] [US1] Create acceptance test for top boundary collision in tests/acceptance/collision-detection.spec.ts
- [X] T013 [P] [US1] Create acceptance test for bottom boundary collision in tests/acceptance/collision-detection.spec.ts
- [X] T014 [P] [US1] Create unit tests for boundary detection in tests/unit/collision/collision-detector.spec.ts

### Implementation for User Story 1

- [X] T015 [US1] Verify collision-detector.ts boundary functions integrate with game loop (T004-T009 from Phase 2)
- [X] T016 [US1] Run acceptance tests for boundary collision to verify detection works correctly
- [X] T017 [US1] Verify all four boundary acceptance tests pass on Chrome, Firefox, Edge, Safari per constitution requirements

**Checkpoint**: At this point, User Story 1 should be fully functional - snake crashes at all grid boundaries

---

## Phase 4: User Story 2 - Self Collision (Priority: P1)

**Goal**: Detect when snake head collides with its own body and end game immediately

**Independent Test**: Steer snake in path that causes head to intersect body and verify game ends immediately

### Tests for User Story 2

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [X] T018 [P] [US2] Create acceptance test for self-collision in tests/acceptance/collision-detection.spec.ts
- [X] T019 [P] [US2] Create acceptance test for self-collision while snake is growing in tests/acceptance/collision-detection.spec.ts
- [X] T020 [P] [US2] Create unit tests for self-collision detection in tests/unit/collision/collision-detector.spec.ts
- [X] T021 [P] [US2] Create unit test for edge case where snake cannot self-collide at length 3 in tests/unit/collision/collision-detector.spec.ts

### Implementation for User Story 2

- [X] T022 [US2] Verify collision-detector.ts self-collision functions integrate correctly (T008 from Phase 2)
- [X] T023 [US2] Run acceptance tests for self-collision to verify detection works correctly
- [X] T024 [US2] Verify all self-collision acceptance tests pass on Chrome, Firefox, Edge, Safari per constitution requirements

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - all collision types detected

---

## Phase 5: User Story 3 - Game Ending State (Priority: P2)

**Goal**: Display semi-transparent overlay with "You crashed" message and automatically restart game after 1-2 seconds

**Independent Test**: Trigger any collision and verify game stops, displays overlay, allows player to see final snake position, and restarts automatically

### Tests for User Story 3

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [X] T025 [P] [US3] Create acceptance test for game-over overlay display in tests/acceptance/collision-detection.spec.ts
- [X] T026 [P] [US3] Create acceptance test for semi-transparent overlay showing final snake position in tests/acceptance/collision-detection.spec.ts
- [X] T027 [P] [US3] Create acceptance test for overlay text "You crashed" in tests/acceptance/collision-detection.spec.ts
- [X] T028 [P] [US3] Create acceptance test for automatic restart after 1-2 seconds in tests/acceptance/collision-detection.spec.ts
- [X] T029 [P] [US3] Create acceptance test for state reset to initial values after restart in tests/acceptance/collision-detection.spec.ts
- [X] T030 [P] [US3] Create unit tests for overlay rendering in tests/unit/collision/game-over-overlay.spec.ts

### Implementation for User Story 3

- [X] T031 [US3] Create game-over-overlay.ts in src/collision/game-over-overlay.ts
- [X] T032 [P] [US3] Implement renderGameOverOverlay function in src/collision/game-over-overlay.ts (semi-transparent with text)
- [X] T033 [US3] Extend game-state.ts in src/game/game-state.ts to add restartGame function that resets all state
- [X] T034 [US3] Modify game-loop.ts in src/game/game-loop.ts to handle game-over status (ignore ticks when gameStatus is 'game-over')
- [X] T035 [US3] Implement automatic restart with setTimeout(1500ms) after collision in src/game/game-loop.ts
- [X] T036 [US3] Integrate renderGameOverOverlay call into rendering logic when gameStatus is 'game-over' in src/grid/grid-renderer.ts
- [X] T037 [US3] Run acceptance tests for overlay display to verify rendering works correctly
- [X] T038 [US3] Run acceptance tests for automatic restart to verify reset logic works correctly
- [X] T039 [US3] Verify all game-ending state acceptance tests pass on Chrome, Firefox, Edge, Safari per constitution requirements

**Checkpoint**: All user stories should now be independently functional - complete collision detection with overlay and restart

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T040 [P] Update game-loop.ts integration to check collision BEFORE food consumption in src/game/game-loop.ts
- [X] T041 [P] Add edge case handling for collision at exact moment of food consumption per spec in src/game/game-loop.ts
- [X] T042 [P] Run full test suite (unit + acceptance) to verify no regressions
- [X] T043 [P] Verify performance: collision detection completes within 1-second movement tick
- [X] T044 Code cleanup: remove any debugging code, ensure descriptive naming throughout
- [X] T045 Run quickstart.md validation to verify implementation matches documented approach

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (Boundary Collision) and US2 (Self Collision) are both P1 priority and can proceed in parallel or sequentially
  - US3 (Game Ending State) depends on US1 and US2 providing collision detection
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable boundary collision)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with same collision-detector.ts but independently testable self-collision
- **User Story 3 (P2)**: Depends on US1 or US2 (needs collision detection to trigger game-over state) - Cannot start until at least one P1 story complete

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Foundational functions (T004-T009) before story implementation
- Core detection logic before integration into game loop
- Overlay rendering before restart mechanism
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003)
- All Foundational boundary/self functions can run in parallel (T006, T007)
- All acceptance tests within a user story can run in parallel
- All unit tests can run in parallel
- US1 and US2 can theoretically be worked on in parallel by different team members (both depend only on Phase 2)
- T032 (overlay rendering) can run in parallel with T033 (restart function)

---

## Parallel Example: User Story 1

```bash
# Launch all acceptance tests for User Story 1 together:
Task: "Create acceptance test for right boundary collision"
Task: "Create acceptance test for left boundary collision"
Task: "Create acceptance test for top boundary collision"
Task: "Create acceptance test for bottom boundary collision"
Task: "Create unit tests for boundary detection"

# All can run in parallel - different test scenarios
```

## Parallel Example: User Story 3

```bash
# Launch all acceptance tests for User Story 3 together:
Task: "Create acceptance test for game-over overlay display"
Task: "Create acceptance test for semi-transparent overlay"
Task: "Create acceptance test for overlay text"
Task: "Create acceptance test for automatic restart"
Task: "Create acceptance test for state reset"
Task: "Create unit tests for overlay rendering"

# All can run in parallel - different test scenarios

# Launch parallel implementation:
Task: "Implement renderGameOverOverlay function"
Task: "Implement restartGame function"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup - types and module structure
2. Complete Phase 2: Foundational - collision detection functions
3. Complete Phase 3: User Story 1 - Boundary collision detection
4. **STOP and VALIDATE**: Test boundary collision independently
5. Deploy/demo if ready - game now crashes at boundaries

### Incremental Delivery

1. Complete Setup + Foundational → Collision detection functions ready
2. Add User Story 1 → Test independently → Deploy/Demo (Boundary collision works!)
3. Add User Story 2 → Test independently → Deploy/Demo (All collision types detected!)
4. Add User Story 3 → Test independently → Deploy/Demo (Complete game-over experience!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Boundary collision)
   - Developer B: User Story 2 (Self collision)
3. Both US1 and US2 must complete before starting US3
4. Team completes User Story 3 together (overlay + restart)
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify acceptance tests fail before implementing
- All acceptance tests must pass on Chrome, Firefox, Edge, Safari per constitution
- Run `npm test` to execute both unit and acceptance tests
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence