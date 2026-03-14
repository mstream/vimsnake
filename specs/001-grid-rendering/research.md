# Research: Grid Rendering

**Branch**: `001-grid-rendering` | **Date**: 2026-03-14

This document consolidates research findings for implementing a 32×32 grid using browser-based technologies.

## Research Questions

### R1: Canvas API vs DOM Elements for Grid Rendering

**Decision**: HTML Canvas API

**Rationale**:
- Canvas provides pixel-perfect control for game rendering
- Better performance for dense grids (1,024 tiles) - single draw call vs1,024 DOM elements
- Efficient tile updates for future game features (snake movement, food placement)
- Consistent rendering across browsers
- No DOM layout thrashing concerns during game loop
- Lower memory footprint compared to 1,024 individual DOM nodes

**Alternatives Considered**:
- **CSS Grid**: Good for static layouts, but requires 1,024 DOM elements which impacts performance and memory
- **SVG**: Vector-based, but still creates DOM overhead per tile
- **WebGL**: Overkill for a simple 2D grid, adds unnecessary complexity

### R2: TypeScript Configuration for Browser Target

**Decision**: TypeScript 5.x with ES2022 target, strict mode enabled

**Rationale**:
- ES2022 provides modern JavaScript features (top-level await, class fields)
- Wide browser support for ES2022 features
- TypeScript strict mode catches errors at compile time
- No build step complexity needed beyond TypeScript compilation

**Configuration**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "strict": true,
    "noEmit": true,
    "moduleResolution": "bundler"
  }
}
```

### R3: Testing Framework for Browser-Based Grid

**Decision**: Vitest (unit tests) + Playwright (acceptance tests)

**Rationale**:
- **Vitest**: Fast, TypeScript-native, compatible with Vite ecosystem
- **Playwright**: Cross-browser testing, screenshot comparison for visual grid verification, supports user acceptance testing workflow
- Both tools have excellent TypeScript support
- Playwright can verify actual browser rendering of the grid

**Alternatives Considered**:
- **Jest + Puppeteer**: Jest is slower than Vitest, Puppeteer less maintained than Playwright
- **Cypress**: Good for E2E but heavier setup, Playwright more suitable for visual/game testing
- **Mocha**: Older, less integrated tooling

### R4: Build Tooling

**Decision**: Vite

**Rationale**:
- Native TypeScript support via esbuild
- Hot module replacement for rapid development
- Minimal configuration required
- Produces optimized production builds
- Works seamlessly with Vitest for testing

**Alternatives Considered**:
- **esbuild only**: Too minimal, lacks HMR and developmentserver features
- **Webpack**: Overkill for a simple game, slower than Vite
- **tsc only**: No development server or HMR

### R5: Grid Scaling Strategy for Different Viewports

**Decision**: Calculate tile size based on minimum viewport dimension, maintain aspect ratio

**Rationale**:
- Grid must maintain square tiles (spec requirement FR-010)
- Scale entire grid to fit within the smaller of viewport width or height
- Add letterboxing (empty space) when viewport aspect ratio differs from grid
- This ensures all 32×32 tiles are always visible

**Algorithm**:
```
viewportWidth = window.innerWidth - padding
viewportHeight = window.innerHeight - padding
gridAspect = 32 / 32 = 1.0
viewportAspect = viewportWidth / viewportHeight

if (viewportAspect >= 1.0):
  // Viewport is wider or square
  tileSize = viewportHeight / 32
else:
  // Viewport is taller
  tileSize = viewportWidth / 32
```

### R6: Canvas Grid Line Rendering

**Decision**: Draw grid lines after tile fill using stroke paths

**Rationale**:
- Clear separation between tile content and grid lines
- Consistent line thickness across all tiles
- Single stroke operation for all grid lines is performant
- Grid lines drawn on top of tiles ensure visibility (spec requirement FR-011)

**Alternatives Considered**:
- **CSS border on each tile**: N/A (using Canvas)
- **Separate canvas layer for grid lines**: Adds complexity with no clear benefit

### R7: Initialization Timing

**Decision**: Use `DOMContentLoaded` with synchronous Canvas sizing

**Rationale**:
- Grid must appear instantly (spec requirement FR-012)
- No loading indicators permitted
- Canvas must be sized before first render
- `requestAnimationFrame` for first render ensures smooth appearance

**Alternatives Considered**:
- **window.onload**: Slower, waits for all resources
- **defer script**: Works but less explicit about initialization order

## Resolved Technical Clarifications

| Clarification | Resolution |
|--------------|------------|
| Language/version | TypeScript 5.x, ES2022 target |
| Primary dependencies | None (vanilla Canvas API) |
| Storage | N/A (in-memory only for grid state) |
| Testing | Vitest + Playwright |
| Target Platform | Modern browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+) |
| Project Type | Web application (browser-based game) |
| Performance Goals | < 16ms render time (60 fps), instant display |
| Constraints | No external dependencies for core, offline-capable, responsive |
| Scale/Scope | 32×32 = 1,024 tiles, casual game application |

## Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5.4.x | TypeScript compiler |
| vite | 5.x | Build tool and dev server |
| vitest | 1.x | Unit testing framework |
| @playwright/test | 1.42.x | Acceptance testing framework |

Note: All versions will be pinned with exact version numbers in package.json per Constitution X.