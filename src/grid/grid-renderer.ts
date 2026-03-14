import {
  TILE_COUNT_HORIZONTAL,
  TILE_COUNT_VERTICAL,
  GRID_LINE_COLOR,
  GRID_LINE_WIDTH,
  EMPTY_TILE_COLOR,
} from './grid-constants';
import {
  calculateGridRenderMetrics,
  getViewportDimensions,
} from './tile-calculation';

let canvas: HTMLCanvasElement | null = null;
let renderingContext: CanvasRenderingContext2D | null = null;

export function initializeCanvas(): HTMLCanvasElement {
  const canvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (!canvasElement) {
    throw new Error('Canvas element with id "gameCanvas" not found');
  }
  
  canvas = canvasElement;
  resizeCanvas();
  
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to get 2D rendering context from canvas');
  }
  
  renderingContext = context;
  applyHighDpiSettings();
  
  return canvas;
}

function resizeCanvas(): void {
  if (!canvas) return;
  
  const viewportDimensions = getViewportDimensions();
  canvas.width = viewportDimensions.availableWidth;
  canvas.height = viewportDimensions.availableHeight;
  
  applyHighDpiSettings();
}

function applyHighDpiSettings(): void {
  if (!canvas || !renderingContext) return;
  
  const pixelRatio = window.devicePixelRatio || 1;
  
  if (pixelRatio > 1) {
    canvas.width = canvas.width * pixelRatio;
    canvas.height = canvas.height * pixelRatio;
    canvas.style.width = `${canvas.width / pixelRatio}px`;
    canvas.style.height = `${canvas.height / pixelRatio}px`;
    renderingContext.scale(pixelRatio, pixelRatio);
  }
}

export function renderGridBackground(metrics: ReturnType<typeof calculateGridRenderMetrics>): void {
  if (!renderingContext || !canvas) return;
  
  const gridWidth = TILE_COUNT_HORIZONTAL * metrics.tileSizeInPixels;
  const gridHeight = TILE_COUNT_VERTICAL * metrics.tileSizeInPixels;
  
  renderingContext.fillStyle = EMPTY_TILE_COLOR;
  renderingContext.fillRect(
    metrics.offsetX,
    metrics.offsetY,
    gridWidth,
    gridHeight
  );
}

export function renderGridLines(metrics: ReturnType<typeof calculateGridRenderMetrics>): void {
  if (!renderingContext) return;
  
  renderingContext.strokeStyle = GRID_LINE_COLOR;
  renderingContext.lineWidth = GRID_LINE_WIDTH;
  
  const startX = metrics.offsetX;
  const startY = metrics.offsetY;
  const endX = startX + TILE_COUNT_HORIZONTAL * metrics.tileSizeInPixels;
  const endY = startY + TILE_COUNT_VERTICAL * metrics.tileSizeInPixels;
  
  renderingContext.beginPath();
  
  for (let columnIndex = 0; columnIndex <= TILE_COUNT_HORIZONTAL; columnIndex++) {
    const lineX = startX + columnIndex * metrics.tileSizeInPixels;
    renderingContext.moveTo(lineX, startY);
    renderingContext.lineTo(lineX, endY);
  }
  
  for (let rowIndex = 0; rowIndex <= TILE_COUNT_VERTICAL; rowIndex++) {
    const lineY = startY + rowIndex * metrics.tileSizeInPixels;
    renderingContext.moveTo(startX, lineY);
    renderingContext.lineTo(endX, lineY);
  }
  
  renderingContext.stroke();
}

export function initializeGridRenderer(): void {
  initializeCanvas();
  const viewportDimensions = getViewportDimensions();
  const gridMetrics = calculateGridRenderMetrics(viewportDimensions);
  
  renderGridBackground(gridMetrics);
  renderGridLines(gridMetrics);
}

export function handleViewportResize(): void {
  if (!canvas) return;
  
  const viewportDimensions = getViewportDimensions();
  canvas.width = viewportDimensions.availableWidth;
  canvas.height = viewportDimensions.availableHeight;
  
  applyHighDpiSettings();
  
  const gridMetrics = calculateGridRenderMetrics(viewportDimensions);
  renderGridBackground(gridMetrics);
  renderGridLines(gridMetrics);
}