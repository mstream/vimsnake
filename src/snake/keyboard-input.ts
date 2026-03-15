import type { SnakeState } from './snake-types';
import { KEY_TO_DIRECTION } from './snake-constants';
import { queueDirectionChange } from './snake-state';

let snakeState: SnakeState | null = null;

export function initializeKeyboardInput(currentState: SnakeState): void {
  snakeState = currentState;
  document.addEventListener('keydown', handleKeyDown);
  
  if (typeof window !== 'undefined') {
    (window as any).__snakeState__ = () => snakeState;
  }
}

export function cleanupKeyboardInput(): void {
  document.removeEventListener('keydown', handleKeyDown);
  snakeState = null;
  
  if (typeof window !== 'undefined') {
    (window as any).__snakeState__ = null;
  }
}

function handleKeyDown(event: KeyboardEvent): void {
  if (snakeState === null) return;
  
  const newDirection = KEY_TO_DIRECTION[event.key];
  if (newDirection === undefined) return;
  
  snakeState = queueDirectionChange(snakeState, newDirection);
}

export function getCurrentSnakeState(): SnakeState | null {
  return snakeState;
}

export function updateSnakeState(newState: SnakeState): void {
  snakeState = newState;
}