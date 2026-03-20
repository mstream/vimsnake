import { describe, test, expect } from 'vitest';
import { renderGameOverOverlay } from '../../../src/collision/game-over-overlay';

describe('game-over-overlay', () => {
  test('renderGameOverOverlay is a function', () => {
    expect(typeof renderGameOverOverlay).toBe('function');
  });
});