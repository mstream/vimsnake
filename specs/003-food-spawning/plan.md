# Implementation Plan: Food Spawning

**Branch**: `003-food-spawning` | **Date**: 2026-03-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-food-spawning/spec.md`

## Summary

Implement food spawning mechanics for the snake game: food appears randomly on the grid at game start and after consumption, never occupying snake body cells or adjacent cells. When the snake consumes food, the snake grows by one segment and new food spawns at a random valid location. If no valid cells remain, food placement stops.

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target)  
**Primary Dependencies**: Vite 5.1.6 (build), Vitest 1.3.1 (unit tests), Playwright 1.42.1 (acceptance tests), Canvas API (rendering)  
**Storage**: In-memory game state (no persistence)  
**Testing**: Vitest for unit tests, Playwright for acceptance tests  
**Target Platform**: Browser (vanilla JavaScript)  
**Project Type**: Web application (frontend-only game)  
**Performance Goals**: 60 FPS gameplay, <100ms food spawn latency  
**Constraints**: Real-time responsiveness, cross-browser compatibility  
**Scale/Scope**: Single-player game, grid-based 32x32 tiles  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Descriptive Naming ✓
All food-related identifiers must use complete, descriptive names (e.g., `foodPosition`, `spawnFoodAtValidLocation`, `isAdjacentToSnake`).

### II. No Abbreviations ✓
No abbreviations or acronyms in food-related code (already standard in codebase).

### III. Self-Documenting Code (NON-NEGOTIABLE) ✓
Food spawning logic must be decomposed into named functions with clear intent (e.g., `findValidFoodPositions`, `isPositionAdjacentToSnakeBody`).

### IV. No Comments (NON-NEGOTIABLE) ✓
All food-related code must be self-documenting through naming alone.

### V. Clear Intent Through Structure ✓
Food spawning should be a separate module with clear file naming (e.g., `food-state.ts`, `food-spawner.ts`).

### VI. User Acceptance Test Priority (NON-NEGOTIABLE) ✓
Must have acceptance tests for:
- Food appears on game start
- Food spawns away from snake body and adjacency
- Snake grows when consuming food
- New food appears after consumption

### VII. Test Scenarios as Code ✓
All tests must be executable automated tests in the repository.

### VIII. Continuous Test Validation ✓
All tests must pass before merge.

### IX. Reproducible Development Environment ✓
Nix shell with Node.js, TypeScript, Vite, Vitest, Playwright already configured.

### X. Pinned Dependency Versions ✓
All dependencies already pinned in package.json.

### XI. Cross-Browser Compatibility (NON-NEGOTIABLE) ✓
Acceptance tests must run on Chrome, Firefox, Edge, Safari.

**Gate Status**: PASS - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/003-food-spawning/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal interfaces)
└── tasks.md            # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── food/                     # NEW: Food spawning module
│   ├── food-state.ts         # Food state management
│   ├── food-spawner.ts       # Food placement logic
│   ├── food-types.ts         # Type definitions
│   └── food-constants.ts     # Constants
├── game/                     # EXISTING: Game state and loop
│   └── game-loop.ts
├── grid/                     # EXISTING: Grid utilities
│   ├── grid-constants.ts
│   ├── grid-renderer.ts
│   └── tile-calculation.ts
├── snake/                    # EXISTING: Snake state and rendering
│   ├── keyboard-input.ts
│   ├── snake-constants.ts
│   ├── snake-renderer.ts
│   ├── snake-state.ts
│   └── snake-types.ts
└── main.ts                   # EXISTING: Entry point

tests/
├── acceptance/               # Playwright acceptance tests
│   └── food-spawning.spec.ts
└── unit/                     # Vitest unit tests
    └── food/
        ├── food-state.test.ts
        ├── food-spawner.test.ts
        └── food-adjacency.test.ts
```

**Structure Decision**: Adding a new `food/` module following the existing pattern of `snake/`, `grid/`, and `game/` directories. Food module will manage food state, placement logic, and adjacency calculations. Integration with existing snake state for growth mechanics and rendering will happen through the game state.

## Complexity Tracking

> No constitution violations detected - table not required.