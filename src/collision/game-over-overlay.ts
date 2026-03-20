const OVERLAY_ALPHA = 0.7;
const OVERLAY_COLOR = '#000000';
const OVERLAY_TEXT = 'You crashed';
const TEXT_COLOR = '#ffffff';
const TEXT_FONT = 'bold 48px sans-serif';

export function renderGameOverOverlay(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  context.save();
  
  context.globalAlpha = OVERLAY_ALPHA;
  context.fillStyle = OVERLAY_COLOR;
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  context.restore();
  
  context.fillStyle = TEXT_COLOR;
  context.font = TEXT_FONT;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(OVERLAY_TEXT, canvasWidth / 2, canvasHeight / 2);
}