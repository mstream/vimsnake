# Implementation Plan: Snake Movement Control

**Branch**: `002-snake-control` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-snake-control/spec.md`

## Summary

Implement snake movement control using VIM-style keys (h/j/k/l) with continuous movement at 1 cell per second, direction reversal prevention, and single-direction queuing.

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target)
**Primary Dependencies**: Vite 5.1.6 (build), Vitest 1.3.1 (unit tests), Playwright 1.42.1 (acceptance tests)
**Storage**: N/A (in-memory game state)
**Testing**: Vitest for unit tests, Playwright for acceptance tests
**Target Platform**: Browser (Canvas API for rendering)
**Project Type**: Web application (game)
**Performance Goals**: 60 fps rendering, 100ms input latency
**Constraints**: No external libraries for game logic
**Scale/Scope**: Single player, local game state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|------------|--------|----------|
| I. Descriptive Naming | PASS | All functions use descriptive names (createInitialSnakeState, calculateNextHeadPosition, isDirectionReversal, etc.) |
| II. No Abbreviations | PASS | No abbreviations used (TILE_COUNT_HORIZONTAL, TILE_COUNT_VERTICAL, MOVEMENT_TICK_INTERVAL_IN_MILLISECONDS) |
| III. Self-Documenting Code | PASS | Function names communicate intent without comments |
| IV. No Comments | PASS | Source code has no comments |
| V. Clear Intent Through Structure | PASS | Each module has single responsibility |
| VI. User Acceptance Test Priority | PASS | Acceptance tests written before implementation |
| VII. Test Scenarios as Code | PASS | Tests in repository as Vitest/Playwright files |
| VIII. Continuous Test Validation | PASS | npm test runs all tests |
| IX. Reproducible Development Environment | PASS | Nix flake with pinned Node.js 20 |
| X. Pinned Dependency Versions | PASS | package.json uses exact versions |

## Project Structure

### Documentation (this feature)

```text
specs/002-snake-control/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── grid/                 # Existing grid module (from 001-grid-rendering)
│   ├── grid-constants.ts
│   ├── grid-renderer.ts
│   └── tile-calculation.ts
├── snake/                # Snake movement module
│   ├── snake-types.ts     # Core types (MovementDirection, SnakeState, etc.)
│   ├── snake-constants.ts # Direction vectors, key mappings
│   ├── snake-state.ts     # State management functions
│   ├── keyboard-input.ts  # VIM key input handling
│   └── snake-renderer.ts  # Canvas rendering
├── game/                 # Game loop module
│   └── game-loop.ts       # Tick-based movement system
└── main.ts                # Application entry point

tests/
├── acceptance/           # Playwright tests
│   ├── grid-visibility.spec.ts
│   └── snake-movement.spec.ts
└── unit/                 # Vitest tests
    ├── tile-calculation.spec.ts
    └── snake/
        ├── snake-state.spec.ts
        └── keyboard-input.spec.ts
```

**Structure Decision**: Single project structure with separate modules for grid, snake, and game logic. Tests organized by type (acceptance vs unit) following constitution requirements.

## Complexity Tracking

> No constitution violations requiring justification.

## Implementation Status

**Phase 0 (Research)**: COMPLETE
- All design decisions documented in research.md
- Clarifications recorded in spec.md

**Phase 1 (Design)**: COMPLETE
- data-model.md defines all types and state transitions
- quickstart.md provides integration guide
- Code implemented and tested

**Phase 2 (Tasks)**: IN PROGRESS
- tasks.md generated
- Implementation complete
- Bug fixes applied:
  - State synchronization: Game loop now pulls state from keyboard-input module
  - Reversal check: Now checks against pending direction when set
  - Tick order: Apply pending direction, move, then render

## Key Design Decisions from Clarification

1. **Tick Timing**: Direction changes apply at START of tick (apply pending → move → render)
2. **State Sync**: Pull pattern - game loop reads from keyboard-input at each tick
3. **Rendering**: render AFTER tick completes for immediate visual feedback
4. **Reversal Check**: Check against pending direction if set, otherwise current direction