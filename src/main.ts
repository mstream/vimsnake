import { initializeGridRenderer, handleViewportResize } from './grid/grid-renderer';

function initializeApplication(): void {
  initializeGridRenderer();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApplication();
});

window.addEventListener('resize', () => {
  handleViewportResize();
});