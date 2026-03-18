# Tasks: Food Spawning

**Input**: Design documents from `/specs/003-food-spawning/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/module-integration.md (complete)

**Tests**: Acceptance tests are REQUIRED per constitution (Principle VI: User Acceptance Test Priority). Unit tests are OPTIONAL for edge cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Following plan.md structure:
- **Source code**: `src/` at repository root
- **Tests**: `tests/` at repository root
- **Food module**: `src/food/`
- **Game module**: `src/game/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create initial module structure and type definitions

- [ ] T001 Create food module directory structure `src/food/`
- [ ] T002 [P] Define FoodPosition and FoodState types in `src/food/food-types.ts`
- [ ] T003 [P] Define food rendering constants in `src/food/food-constants.ts` (color, size)

**Checkpoint**: Module structure ready, types defined

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement adjacency calculation function in `src/food/food-adjacency.ts`
- [ ] T005 [P] Implement position validation function `isValidFoodPosition` in `src/food/food-spawner.ts`
- [ ] T006 [P] Implement valid position finder `findValidFoodPositions` in `src/food/food-spawner.ts`
- [ ] T007 [P] Implement valid position checker `hasValidFoodPositions` in `src/food/food-spawner.ts`
- [ ] T008 [P] Write unit tests for adjacency calculation in `tests/unit/food/food-adjacency.test.ts`

**Checkpoint**: Foundation ready - position validation and adjacency calculation complete

---

## Phase 3: User Story 1 - Initial Food Placement (Priority: P1) 🎯 MVP

**Goal**: At the start of the game, food appears on the grid in a valid location away from the snake's initial position and its immediate surroundings.

**Independent Test**: Start a new game and verify that food appears on the grid in a valid location (not on or adjacent to the snake).

### Acceptance Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Create acceptance test: food appears on game start in `tests/acceptance/food-spawning.spec.ts`
- [ ] T010 [P] [US1] Create acceptance test: food not positioned on snake body in `tests/acceptance/food-spawning.spec.ts`
- [ ] T011 [P] [US1] Create acceptance test: food not positioned adjacent to snake body in `tests/acceptance/food-spawning.spec.ts`
- [ ] T012 [P] [US1] Create acceptance test: food occupies exactly one grid cell in `tests/acceptance/food-spawning.spec.ts`

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement random position selection `spawnFoodAtRandomPosition` in `src/food/food-spawner.ts`
- [ ] T014 [US1] Implement food state creation function `createInitialFoodState` in `src/food/food-state.ts`
- [ ] T015 [US1] Create or extend GameState type in `src/game/game-types.ts`
- [ ] T016 [US1] Implement initial game state creation `createInitialGameState` in `src/game/game-state.ts`
- [ ] T017 [US1] Implement food rendering in `src/food/food-renderer.ts`
- [ ] T018 [US1] Integrate food state into game loop initialization in `src/game/game-loop.ts`
- [ ] T019 [US1] Run acceptance tests for User Story 1 and verify all pass

**Checkpoint**: At this point, User Story 1 should be fully functional - food appears on game start in valid position

---

## Phase 4: User Story 2 - Food Consumption and Growth (Priority: P1)

**Goal**: When the snake moves onto a cell containing food, the food disappears, the snake grows by one segment, and a new food item appears in a valid random location.

**Independent Test**: Move the snake to consume food and verify the snake grows and new food appears at a valid location.

### Acceptance Tests for User Story 2

- [ ] T020 [P] [US2] Create acceptance test: food disappears when snake head overlaps in `tests/acceptance/food-spawning.spec.ts`
- [ ] T021 [P] [US2] Create acceptance test: snake grows by one segment when consuming food in `tests/acceptance/food-spawning.spec.ts`
- [ ] T022 [P] [US2] Create acceptance test: new food appears after consumption in `tests/acceptance/food-spawning.spec.ts`
- [ ] T023 [P] [US2] Create acceptance test: new food follows placement rules after consumption in `tests/acceptance/food-spawning.spec.ts`

### Implementation for User Story 2

- [ ] T024 [P] [US2] Implement `hasFoodAtPosition` check function in `src/food/food-state.ts`
- [ ] T025 [P] [US2] Add `isSnakeGrowing` flag to GameState type in `src/game/game-types.ts`
- [ ] T026 [US2] Modify `moveSnake` function to accept `isGrowing` parameter in `src/snake/snake-state.ts`
- [ ] T027 [US2] Implement `consumeFood` function in `src/food/food-state.ts`
- [ ] T028 [US2] Implement respawn logic in `consumeFood` or new function `respawnFood` in `src/food/food-state.ts`
- [ ] T029 [US2] Integrate food consumption detection into game loop in `src/game/game-loop.ts`
- [ ] T030 [US2] Integrate growth flag reset into game loop in `src/game/game-loop.ts`
- [ ] T031 [US2] Handle edge case: no valid positions in `consumeFood` in `src/food/food-state.ts`
- [ ] T032 [US2] Run acceptance tests for User Story 2 and verify all pass

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - complete food cycle with growth

---

## Phase 5: User Story 3 - Continuous Random Food Placement (Priority: P2)

**Goal**: Each new food item appears in a random valid location across multiple game sessions, demonstrating randomness and varied gameplay.

**Independent Test**: Play multiple games and verify food appears in different positions across sessions.

### Acceptance Tests for User Story 3

- [ ] T033 [P] [US3] Create acceptance test: food position varies across game sessions in `tests/acceptance/food-spawning.spec.ts`
- [ ] T034 [P] [US3] Create acceptance test: valid cell pool shrinks as snake grows in `tests/acceptance/food-spawning.spec.ts`
- [ ] T035 [P] [US3] Create acceptance test: randomness distribution over multiple spawns in `tests/acceptance/food-spawning.spec.ts`

### Implementation for User Story 3

- [ ] T036 [US3] Write unit test for pool-based random selection in `tests/unit/food/food-spawner.test.ts`
- [ ] T037 [US3] Verify `spawnFoodAtRandomPosition` uses `Math.random()` for uniform selection in `src/food/food-spawner.ts`
- [ ] T038 [US3] Add unit test for edge case: empty valid position pool handling in `tests/unit/food/food-spawner.test.ts`
- [ ] T039 [US3] Run acceptance tests for User Story 3 and verify all pass

**Checkpoint**: All user stories complete - randomness verified across sessions

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Add unit tests for food state management in `tests/unit/food/food-state.test.ts`
- [ ] T041 [P] Add unit tests for edge cases (grid boundaries, long snake) in `tests/unit/food/food-adjacency.test.ts`
- [ ] T042 Run all acceptance tests on all browsers (Chrome, Firefox, Edge, Safari) per constitution
- [ ] T043 Run linting and type checking per AGENTS.md: `npm run lint`
- [ ] T044 Run all tests: `npm test`
- [ ] T045 Verify quickstart.md implementation steps align with completed tasks

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 can start after Foundational
  - US2 depends on US1 (needs food placement to test consumption)
  - US3 depends on US1 and US2 (needs basic food spawn and respawn to test randomness)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 complete - Needs food to exist before testing consumption
- **User Story 3 (P2)**: Depends on User Story 1 and 2 complete - Needs basic spawn/respawn to test randomness

### Within Each User Story

- Acceptance tests MUST be written and FAIL before implementation
- Core functions (types, adjacency) before state management
- State management before game integration
- Integration before rendering

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003 can run in parallel (different files)

**Phase 2 (Foundational)**:
- T005, T006, T007 can run in parallel (different functions, same file)
- T008 can run in parallel with T005-T007 (test file vs source files)

**Phase 3 (US1 - Tests)**:
- T009-T012 can run in parallel (different test cases)

**Phase 3 (US1 - Implementation)**:
- T013, T014 can run in parallel (different files)

**Phase 4 (US2 - Tests)**:
- T020-T023 can run in parallel (different test cases)

**Phase 4 (US2 - Implementation)**:
- T024, T025 can run in parallel (different files)

**Phase 5 (US3 - Tests)**:
- T033-T035 can run in parallel (different test cases)

**Phase 6 (Polish)**:
- T040, T041 can run in parallel (different test files)

---

## Parallel Example: User Story 1

```bash
# Phase 3 - US1 Acceptance Tests (run in parallel):
Task T009: "Create acceptance test: food appears on game start"
Task T010: "Create acceptance test: food not on snake body"
Task T011: "Create acceptance test: food not adjacent to snake body"
Task T012: "Create acceptance test: food occupies one cell"

# Phase 3 - US1 Implementation (run in parallel):
Task T013: "Implement spawnFoodAtRandomPosition in src/food/food-spawner.ts"
Task T014: "Implement createInitialFoodState in src/food/food-state.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T008) - CRITICAL
3. Complete Phase 3: User Story 1 (T009-T019)
4. **STOP and VALIDATE**: Run acceptance tests for US1
5. Deploy/demo: Food appears on game start in valid position

### Incremental Delivery

1. Setup + Foundational → Foundation ready (can validate adjacency and position logic)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Complete food cycle)
4. Add User Story 3 → Test independently → Deploy/Demo (Randomness verified)
5. Each story adds value without breaking previous stories

### Constitution Compliance

Per Constitution Principle VI (User Acceptance Test Priority):
- Acceptance tests are written BEFORE implementation
- Each user story has acceptance tests that MUST fail before implementation
- Unit tests are added only for edge cases not covered by acceptance tests
- Acceptance tests run on all supported browsers (Chrome, Firefox, Edge, Safari)

---

## Task Summary

- **Total Tasks**: 45
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (US1)**: 11 tasks (4 tests + 7 implementation)
- **Phase 4 (US2)**: 13 tasks (4 tests + 9 implementation)
- **Phase 5 (US3)**: 7 tasks (3 tests + 4 implementation)
- **Phase 6 (Polish)**: 6 tasks
- **Parallel Opportunities**: 26 tasks marked [P]

**Suggested MVP Scope**: User Story 1 only (Phases 1-3)
**Estimated Effort**: 4-6 hours total (per quickstart.md)

---

## Notes

- [P] tasks = different files or functions, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify acceptance tests fail before implementing
- Run `npm test` after each phase to validate
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requires: self-documenting code, no comments, no abbreviations
- Acceptance tests must pass on Chrome, Firefox, Edge, Safari