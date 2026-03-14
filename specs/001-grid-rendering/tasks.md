# Tasks: Grid Rendering

**Input**: Design documents from `/specs/001-grid-rendering/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Included per Constitution VI (User Acceptance Test Priority) and VII (Test Scenarios as Code)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and basic structure

- [x] T001 Create project directory structure per implementation plan
- [x] T002 Initialize package.json with pinned dependency versions (TypeScript 5.4.x, Vite 5.x, Vitest1.x, Playwright 1.42.x)
- [x] T003 [P] Create tsconfig.json with ES2022 target and strict mode configuration
- [x] T004 [P] Create vite.config.ts for build and development server
- [x] T005 [P] Create vitest.config.ts for unit test configuration
- [x] T006 [P] Create playwright.config.ts for acceptance test configuration
- [x] T007 [P] Create index.html entry point with Canvas element
- [x] T008 Update flake.nix to include Node.js and test tools for reproducible development environment

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core modules that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create GridConfiguration constants in src/grid/grid-constants.ts (fixed 32×32 dimensions, colors, line width)
- [x] T010 Create TilePosition type definition in src/grid/grid-constants.ts
- [x] T011 Create TileRenderBounds type definition in src/grid/grid-constants.ts
- [x] T012 Create ViewportDimensions type definition in src/grid/grid-constants.ts
- [x] T013 Create GridRenderMetrics type definition in src/grid/grid-constants.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Complete Game Grid (Priority: P1) 🎯 MVP

**Goal**: Display a complete 32×32 rectangular grid with 1,024 visible tiles immediately on application launch

**Independent Test**: Launch application and verify that a complete 32×32 rectangular grid renders on screen with visible tile boundaries

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T014 [P] [US1] Create acceptance test for grid visibility in tests/acceptance/grid-visibility.spec.ts (verifies 32×32 grid renders with boundaries within 2 seconds)
- [x] T015 [P] [US1] Create unit test for tile calculation in tests/unit/tile-calculation.spec.ts (verifies tile size and position math)

### Implementation for User Story 1

- [x] T016 Implement calculateTileSize function in src/grid/tile-calculation.ts (derives tile pixels from viewport dimensions)
- [x] T017 Implement calculateGridRenderMetrics function in src/grid/tile-calculation.ts (computes total grid dimensions and letterboxing offsets)
- [x] T018 Implement calculateTileRenderBounds function in src/grid/tile-calculation.ts (computes pixel bounds for any tile position)
- [x] T019 Implement initializeCanvas function in src/grid/grid-renderer.ts (sets up Canvas element and 2D context)
- [x] T020 Implement renderGridBackground function in src/grid/grid-renderer.ts (fills grid area with empty tile color)
- [x] T021 Implement renderGridLines function in src/grid/grid-renderer.ts (draws grid lines between all adjacent tiles)
- [x] T022 Implement initializeGridRenderer function in src/grid/grid-renderer.ts (orchestrates canvas setup and initial grid render)
- [x] T023 Wire entry point in src/main.ts to call initializeGridRenderer on DOMContentLoaded

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate Grid Visually (Priority: P2)

**Goal**: Enable users to visually distinguish individual tiles with clear boundaries and uniform spacing

**Independent Test**: Display grid and verify that tile boundaries are clearly visible and users can visually identify any specific tile location

### Tests for User Story 2

- [x] T024 [P] [US2] Create acceptance test for tile boundary visibility in tests/acceptance/grid-visibility.spec.ts (verifies clear separation between adjacent tiles)
- [x] T025 [P] [US2] Create acceptance test for tile coordinate identification in tests/acceptance/grid-visibility.spec.ts (verifies users can locate tiles by row/column)

### Implementation for User Story 2

- [x] T026 [US2] Enhance renderGridLines in src/grid/grid-renderer.ts to ensure consistent 1-pixel line thickness
- [x] T027 [US2] Add validateTilePosition function in src/grid/tile-calculation.ts (validates coordinates are within [0, 31] range)
- [x] T028 [US2] Create getTileAtPosition function in src/grid/tile-calculation.ts (converts screen coordinates to tile position)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Grid Accessibility Across Displays (Priority: P3)

**Goal**: Ensure the grid scales proportionally for different viewport sizes while maintaining square tiles

**Independent Test**: Display grid at various viewport sizes and verify all32×32 tiles remain visible with proper letterboxing

### Tests for User Story 3

- [x] T029 [P] [US3] Create acceptance test for viewport scaling in tests/acceptance/grid-visibility.spec.ts (verifies grid scales to fit viewport)
- [x] T030 [P] [US3] Create acceptance test for aspect ratio handling in tests/acceptance/grid-visibility.spec.ts (verifies letterboxing on non-square viewports)
- [x] T031 [P] [US3] Create acceptance test for square tile proportions in tests/acceptance/grid-visibility.spec.ts (verifies tiles remain square at all sizes)

### Implementation for User Story 3

- [x] T032 Implement getViewportDimensions function in src/grid/tile-calculation.ts (extracts available width/height from window)
- [x] T033 [US3] Implement handleViewportResize function in src/grid/grid-renderer.ts (responds to window resize events)
- [x] T034 [US3] Add device pixel ratio handling to initializeCanvas for high-DPI displays
- [x] T035 [US3] Wire resize event listener in src/main.ts to trigger handleViewportResize

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T036 [P] Validate all acceptance tests pass with Playwright
- [x] T037 [P] Validate all unit tests pass with Vitest
- [x] T038 [P] Add render performance test in tests/acceptance/grid-visibility.spec.ts (verifies grid renders within 16ms for 60fps target)
- [x] T039 Add npm scripts to package.json (dev, test, test:unit, test:acceptance, build)
- [x] T040 Verify Constitution compliance (descriptive naming, no abbreviations, no comments)
- [x] T041 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (builds on grid rendering foundation)
- **User Story 3 (P3)**: Depends on User Story 1 (builds on grid rendering foundation)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Types and constants before functions
- Calculation functions before rendering functions
- Rendering functions before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003-T008)
- All Foundational type definitions marked [P] can run in parallel (T010-T013)
- Tests within a user story marked [P] can run in parallel
- Different user stories cannot run in parallel (US2 and US3 both depend on US1)

---

## Parallel Example: Setup Phase

```bash
# Launch all configuration files in parallel:
Task: "Create tsconfig.json"
Task: "Create vite.config.ts"
Task: "Create vitest.config.ts"
Task: "Create playwright.config.ts"
Task: "Create index.html"
```

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Create acceptance test for grid visibility"
Task: "Create unit test for tile calculation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Single Developer Strategy

1. Complete Setup (Phase 1)
2. Complete Foundational (Phase 2)
3. Complete User Story 1 (Phase 3) - MVP milestone
4. Complete User Story 2 (Phase 4)
5. Complete User Story 3 (Phase 5)
6. Complete Polish (Phase 6)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requires: descriptive naming, no abbreviations, no comments, UAT priority
- Total: 41 tasks (8 setup, 5 foundational, 10 US1, 5 US2, 7 US3, 6 polish)