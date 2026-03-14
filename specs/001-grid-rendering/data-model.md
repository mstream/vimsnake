# Data Model: Grid Rendering

**Branch**: `001-grid-rendering` | **Date**: 2026-03-14

## Entities

### GridConfiguration

Immutable configuration defining the grid structure.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `tileCountHorizontal` | `number` | Number of tiles across (width) | Fixed: 32 |
| `tileCountVertical` | `number` | Number of tiles down (height) | Fixed: 32 |
| `gridLineColor` | `string` | CSS color for grid lines | Default: `#000000` |
| `gridLineWidth` | `number` | Width of grid lines in pixels | Default: 1 |
| `emptyTileColor` | `string` | CSS color for empty tiles | Default: `#ffffff` |

**Total Tiles**: `tileCountHorizontal ×tileCountVertical` = 1,024

### TilePosition

Represents a single tile's position in the grid.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `columnIndex` | `number` | Zero-based column (0-31) | `0 <= columnIndex < 32` |
| `rowIndex` | `number` | Zero-based row (0-31) | `0 <= rowIndex < 32` |

**Coordinate System**: Origin at top-left corner. Column increases rightward, row increases downward.

### TileRenderBounds

Calculated rendering boundaries for a single tile.

| Field | Type | Description |
|-------|------|-------------|
| `positionX` | `number` | Left edge position in pixels |
| `positionY` | `number` | Top edge position in pixels |
| `width` | `number` | Tile width in pixels |
| `height` | `number` | Tile height in pixels |

**Note**: All tiles are squares, so `width === height`.

### ViewportDimensions

Current browser viewport information for responsive scaling.

| Field | Type | Description |
|-------|------|-------------|
| `availableWidth` | `number` | Viewport width minus padding |
| `availableHeight` | `number` | Viewport height minus padding |
| `pixelRatio` | `number` | Device pixel ratio for high-DPI displays |

### GridRenderMetrics

Calculated values for rendering the complete grid.

| Field | Type | Description |
|-------|------|-------------|
| `tileSizeInPixels` | `number` | Size of each tile (width and height) |
| `totalGridWidth` | `number` | Full grid width in pixels |
| `totalGridHeight` | `number` | Full grid height in pixels |
| `offsetX` | `number` | Horizontal letterboxing offset |
| `offsetY` | `number` | Vertical letterboxing offset |

**Derivation**:
```
tileSizeInPixels = Math.min(availableWidth, availableHeight) / 32
totalGridWidth = tileSizeInPixels * 32
totalGridHeight = tileSizeInPixels * 32
offsetX = (availableWidth - totalGridWidth) / 2
offsetY = (availableHeight - totalGridHeight) / 2
```

## Relationships

```
GridConfiguration (1) ---> (*) TilePosition
                      |
                      +---> (1) GridRenderMetrics
                                    |
ViewportDimensions (1) ------------+
```

- `GridConfiguration` defines the static structure (32×32)
- `ViewportDimensions` provides runtime viewport size
- `GridRenderMetrics` is calculated from configuration + viewport
- `TilePosition` references a specific tile by coordinates
- `TileRenderBounds` is calculated from `TilePosition` + `GridRenderMetrics`

## State Transitions

### Grid Initialization

```
[Application Start] --> [Create GridConfiguration] --> [Calculate GridRenderMetrics] --> [Render Grid]
                              |                              |
                              v                              v
                        [Fixed: 32×32]             [Depends on viewport]
```

### Viewport Resize

```
[Resize Event] --> [Update ViewportDimensions] --> [Recalculate GridRenderMetrics] --> [Re-render Grid]
```

## Validation Rules

1. **Grid Dimensions**: `tileCountHorizontal` and `tileCountVertical` MUST be exactly 32
2. **Tile Position**: `columnIndex` and `rowIndex` MUST be integers in range [0, 31]3. **Render Bounds**: All pixel values MUST be non-negative
4. **Viewport**: `availableWidth` and `availableHeight` MUST be positive values greater than zero

## Invariants

1. Grid always has exactly 1,024 tiles (32 × 32)
2. All tiles are squares (`width === height`)
3. Grid remains centered in viewport with letterboxing
4. Grid lines arevisible between all adjacent tiles
5. No tile state exists beyond position (all tiles start empty/blank)