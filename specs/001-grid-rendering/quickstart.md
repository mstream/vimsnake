# Quickstart: Grid Rendering

**Branch**: `001-grid-rendering` | **Date**: 2026-03-14

## Prerequisites

1. **Nix installed** (for reproducible development environment)
2. **Modern browser** (Chrome 120+, Firefox 120+, Safari 17+, or Edge 120+)

## Setup

```bash
# Enter development environment
nix-shell# or: nix develop

# Install dependencies
npm install
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Open browser to http://localhost:5173
# The 32×32 grid should be immediately visible
```

## Testing

```bash
# Run all tests
npm run test

# Run only unit tests
npm run test:unit

# Run only acceptance tests (requires browser)
npm run test:acceptance

# Run tests with coverage
npm run test:coverage
```

## Verification Checklist

After implementation, verify:

- [ ] Grid displays exactly 32 tiles wide and 32 tiles tall
- [ ] All 1,024 tiles are visible with clear boundaries
- [ ] Grid scales proportionally when resizing browser window
- [ ] Tiles remain square (not stretched) at any viewport size
- [ ] Grid appears centered with letterboxing on non-square viewports
- [ ] No loading indicator - grid renders instantly
- [ ] Grid lines are visible between all adjacent tiles

## Project Structure

```
src/
├── grid/
│   ├── grid-renderer.ts      # Main grid rendering logic
│   ├── tile-calculation.ts   # Tile position/size calculations
│   └── grid-constants.ts     # Grid configuration constants

tests/
├── acceptance/
│   └── grid-visibility.spec.ts    # Playwright UAT
└── unit/
    └── tile-calculation.spec.ts   # Unit tests
```

## Key Files

| File | Purpose |
|------|---------|
| `src/grid/grid-constants.ts` | Fixed configuration (32×32, colors, line width) |
| `src/grid/tile-calculation.ts` | Pure functions fortile math |
| `src/grid/grid-renderer.ts` | Canvas rendering logic |
| `index.html` | Entry point with Canvas element |