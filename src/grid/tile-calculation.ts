import {
  TILE_COUNT_HORIZONTAL,
  TILE_COUNT_VERTICAL,
  VIEWPORT_PADDING,
  type TilePosition,
  type TileRenderBounds,
  type ViewportDimensions,
  type GridRenderMetrics,
  isValidTilePosition,
} from './grid-constants';

export function calculateTileSize(viewportDimensions: ViewportDimensions): number {
  const availableWidth = viewportDimensions.availableWidth - VIEWPORT_PADDING * 2;
  const availableHeight = viewportDimensions.availableHeight - VIEWPORT_PADDING * 2;
  const smallerDimension = Math.min(availableWidth, availableHeight);
  return Math.max(1, smallerDimension / TILE_COUNT_HORIZONTAL);
}

export function calculateGridRenderMetrics(
  viewportDimensions: ViewportDimensions
): GridRenderMetrics {
  const tileSizeInPixels = calculateTileSize(viewportDimensions);
  const totalGridWidth = tileSizeInPixels * TILE_COUNT_HORIZONTAL;
  const totalGridHeight = tileSizeInPixels * TILE_COUNT_VERTICAL;
  const offsetX = (viewportDimensions.availableWidth - totalGridWidth) / 2;
  const offsetY = (viewportDimensions.availableHeight - totalGridHeight) / 2;

  return {
    tileSizeInPixels,
    totalGridWidth,
    totalGridHeight,
    offsetX,
    offsetY,
  };
}

export function calculateTileRenderBounds(
  tilePosition: TilePosition,
  gridMetrics: GridRenderMetrics
): TileRenderBounds {
  const positionX = gridMetrics.offsetX + tilePosition.columnIndex * gridMetrics.tileSizeInPixels;
  const positionY = gridMetrics.offsetY + tilePosition.rowIndex * gridMetrics.tileSizeInPixels;
  const width = gridMetrics.tileSizeInPixels;
  const height = gridMetrics.tileSizeInPixels;

  return {
    positionX,
    positionY,
    width,
    height,
  };
}

export function getViewportDimensions(): ViewportDimensions {
  return {
    availableWidth: window.innerWidth,
    availableHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

export function getTileAtPosition(
  screenX: number,
  screenY: number,
  gridMetrics: GridRenderMetrics
): TilePosition | null {
  const relativeX = screenX - gridMetrics.offsetX;
  const relativeY = screenY - gridMetrics.offsetY;
  
  const columnIndex = Math.floor(relativeX / gridMetrics.tileSizeInPixels);
  const rowIndex = Math.floor(relativeY / gridMetrics.tileSizeInPixels);
  
  const position = { columnIndex, rowIndex };
  
  if (isValidTilePosition(position)) {
    return position;
  }
  
  return null;
}