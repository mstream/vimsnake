export const TILE_COUNT_HORIZONTAL = 32;
export const TILE_COUNT_VERTICAL = 32;
export const TOTAL_TILE_COUNT = TILE_COUNT_HORIZONTAL * TILE_COUNT_VERTICAL;
export const GRID_LINE_COLOR = '#000000';
export const GRID_LINE_WIDTH = 1;
export const EMPTY_TILE_COLOR = '#ffffff';
export const VIEWPORT_PADDING = 0;

export interface TilePosition {
  columnIndex: number;
  rowIndex: number;
}

export interface TileRenderBounds {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

export interface ViewportDimensions {
  availableWidth: number;
  availableHeight: number;
  pixelRatio: number;
}

export interface GridRenderMetrics {
  tileSizeInPixels: number;
  totalGridWidth: number;
  totalGridHeight: number;
  offsetX: number;
  offsetY: number;
}

export function isValidTilePosition(position: TilePosition): boolean {
  return (
    Number.isInteger(position.columnIndex) &&
    Number.isInteger(position.rowIndex) &&
    position.columnIndex >= 0 &&
    position.columnIndex < TILE_COUNT_HORIZONTAL &&
    position.rowIndex >= 0 &&
    position.rowIndex < TILE_COUNT_VERTICAL
  );
}

export function createTilePosition(columnIndex: number, rowIndex: number): TilePosition {
  return { columnIndex, rowIndex };
}