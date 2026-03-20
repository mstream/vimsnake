# Implementation Plan: Collision Detection

**Branch**: `004-collision-detection` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-collision-detection/spec.md`

## Summary

Implement collision detection for the snake game: detect when the snake's head collides with grid boundaries or its own body. When collision occurs, display a semi-transparent overlay with "You crashed"message for 1-2 seconds, then automatically restart the game with initial state. Collision detection must happen on every movement tick before the snake renders.

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target)  
**Primary Dependencies**: Vite 5.1.6 (build), Vitest 1.3.1 (unit tests), Playwright 1.42.1 (acceptance tests), Canvas API (rendering)  
**Storage**: In-memory game state (no persistence)  
**Testing**: Vitest for unit tests, Playwright for acceptance tests  
**Target Platform**: Browser (vanilla JavaScript)  
**Project Type**: Web application (frontend-only game)  
**Performance Goals**: Collision detection within movement tick (<1000ms), immediate game end on collision  
**Constraints**: Real-time responsiveness, cross-browser compatibility  
**Scale/Scope**: Single-player game, grid-based 32x32 tiles  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Descriptive Naming ✓
All collision-related identifiers must use complete, descriptive names (e.g., `hasBoundaryCollision`, `hasSelfCollision`, `isPositionOutsideGridBounds`, `isSnakeHeadOnBody`).

### II. No Abbreviations ✓
No abbreviations or acronyms in collision-related code (already standard in codebase).

### III. Self-Documenting Code (NON-NEGOTIABLE) ✓
Collision detection logic must be decomposed into named functions with clear intent (e.g., `detectCollisionAtPosition`, `checkGridBoundaryCollision`, `checkSelfCollision`).

### IV. No Comments (NON-NEGOTIABLE) ✓
All collision-related code must be self-documenting through naming alone.

### V. Clear Intent Through Structure ✓
Collision detection should be a separate module with clear file naming (e.g., `collision-detector.ts`, `collision-types.ts`).

### VI. User Acceptance Test Priority (NON-NEGOTIABLE) ✓
Must have acceptance tests for:
- Snake crashes at right grid boundary
- Snake crashes at left grid boundary
- Snake crashes at top grid boundary
- Snake crashes at bottom grid boundary
- Snake crashes into its own body
- Game overlay appears on collision
- Game restarts automatically after collision

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
specs/004-collision-detection/
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
├── collision/                  # NEW: Collision detection module
│   ├── collision-types.ts       # Type definitions
│   ├── collision-detector.ts    # Collision detection logic
│   └── game-over-overlay.ts     # Game-over overlay rendering
├── game/                        # EXISTING: Game state and loop
│   ├── game-types.ts           # EXTEND: Add collision state
│   ├── game-state.ts           # MODIFY: Add collision handling
│   └── game-loop.ts            # MODFIY: Integrate collision checks
├── food/                        # EXISTING: Food spawning module
│   └── [existing files]
├── grid/                        # EXISTING: Grid utilities
│   └── [existing files]
├── snake/                       # EXISTING: Snake state and rendering
│   └── [existing files]
└── main.ts                      # EXISTING: Entry point

tests/
├── acceptance/                  # Playwright acceptance tests
│   └── collision-detection.spec.ts
└── unit/                        # Vitest unit tests
    └── collision/
        ├── collision-detector.spec.ts
        └── game-over-overlay.spec.ts
```

**Structure Decision**: Adding a new `collision/` module following the existing pattern of `snake/`, `grid/`, `food/`, and `game/` directories. Collision module will manage boundary detection, self-collision detection, and game-over overlay rendering. Integration with existing game state and loop will happen through the game state management system.

## Complexity Tracking

> No constitution violations detected - table not required.