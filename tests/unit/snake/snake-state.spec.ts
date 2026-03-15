import { describe, expect, it } from 'vitest';
import {
  createInitialSnakeState,
  calculateNextHeadPosition,
  isDirectionReversal,
  queueDirectionChange,
  applyPendingDirection,
  moveSnake,
} from '../../../src/snake/snake-state';
import type { SnakeState, GridPosition } from '../../../src/snake/snake-types';

describe('createInitialSnakeState', () => {
  it('should create snake with 3 cells', () => {
    const state = createInitialSnakeState();
    expect(state.body.length).toBe(3);
  });

  it('should place head at grid center', () => {
    const state = createInitialSnakeState();
    expect(state.body[0].x).toBe(16);
    expect(state.body[0].y).toBe(16);
  });

  it('should orient body vertically above head', () => {
    const state = createInitialSnakeState();
    expect(state.body[1]).toEqual({ x: 16, y: 15 });
    expect(state.body[2]).toEqual({ x: 16, y: 14 });
  });

  it('should initialize with downward direction', () => {
    const state = createInitialSnakeState();
    expect(state.currentDirection).toBe('down');
  });

  it('should have no pending direction', () => {
    const state = createInitialSnakeState();
    expect(state.pendingDirection).toBeNull();
  });
});

describe('calculateNextHeadPosition', () => {
  it('should calculate next position for downward movement', () => {
    const head: GridPosition = { x: 10, y: 10 };
    const nextPos = calculateNextHeadPosition(head, 'down');
    expect(nextPos).toEqual({ x: 10, y: 11 });
  });

  it('should calculate next position for upward movement', () => {
    const head: GridPosition = { x: 10, y: 10 };
    const nextPos = calculateNextHeadPosition(head, 'up');
    expect(nextPos).toEqual({ x: 10, y: 9 });
  });

  it('should calculate next position for leftward movement', () => {
    const head: GridPosition = { x: 10, y: 10 };
    const nextPos = calculateNextHeadPosition(head, 'left');
    expect(nextPos).toEqual({ x: 9, y: 10 });
  });

  it('should calculate next position for rightward movement', () => {
    const head: GridPosition = { x: 10, y: 10 };
    const nextPos = calculateNextHeadPosition(head, 'right');
    expect(nextPos).toEqual({ x: 11, y: 10 });
  });
});

describe('isDirectionReversal', () => {
  it('should detect reversal from up to down', () => {
    expect(isDirectionReversal('up', 'down')).toBe(true);
  });

  it('should detect reversal from down to up', () => {
    expect(isDirectionReversal('down', 'up')).toBe(true);
  });

  it('should detect reversal from left to right', () => {
    expect(isDirectionReversal('left', 'right')).toBe(true);
  });

  it('should detect reversal from right to left', () => {
    expect(isDirectionReversal('right', 'left')).toBe(true);
  });

  it('should not detect reversal between perpendicular directions', () => {
    expect(isDirectionReversal('up', 'left')).toBe(false);
    expect(isDirectionReversal('up', 'right')).toBe(false);
    expect(isDirectionReversal('down', 'left')).toBe(false);
    expect(isDirectionReversal('down', 'right')).toBe(false);
    expect(isDirectionReversal('left', 'up')).toBe(false);
    expect(isDirectionReversal('left', 'down')).toBe(false);
    expect(isDirectionReversal('right', 'up')).toBe(false);
    expect(isDirectionReversal('right', 'down')).toBe(false);
  });

  it('should not detect reversal for same direction', () => {
    expect(isDirectionReversal('up', 'up')).toBe(false);
    expect(isDirectionReversal('down', 'down')).toBe(false);
    expect(isDirectionReversal('left', 'left')).toBe(false);
    expect(isDirectionReversal('right', 'right')).toBe(false);
  });
});

describe('queueDirectionChange', () => {
  it('should queue valid direction change', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: null,
    };
    
    const newState = queueDirectionChange(state, 'left');
    expect(newState.pendingDirection).toBe('left');
  });

  it('should ignore reversal direction change', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: null,
    };
    
    const newState = queueDirectionChange(state, 'up');
    expect(newState.pendingDirection).toBeNull();
  });

  it('should check reversal against pending direction when set', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: 'right',
    };
    
    const newState = queueDirectionChange(state, 'up');
    expect(newState.pendingDirection).toBe('up');
  });

  it('should block reversal against pending direction', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: 'right',
    };
    
    const newState = queueDirectionChange(state, 'left');
    expect(newState.pendingDirection).toBe('right');
  });

  it('should allow perpendicular direction when pending is set', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: 'left',
    };
    
    const newState = queueDirectionChange(state, 'up');
    expect(newState.pendingDirection).toBe('up');
  });

  it('should return unchanged state for reversal', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: null,
    };
    
    const newState = queueDirectionChange(state, 'up');
    expect(newState).toBe(state);
  });
});

describe('applyPendingDirection', () => {
  it('should apply pending direction and clear it', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: 'left',
    };
    
    const newState = applyPendingDirection(state);
    expect(newState.currentDirection).toBe('left');
    expect(newState.pendingDirection).toBeNull();
  });

  it('should return unchanged state when no pending direction', () => {
    const state: SnakeState = {
      body: [{ x: 10, y: 10 }],
      currentDirection: 'down',
      pendingDirection: null,
    };
    
    const newState = applyPendingDirection(state);
    expect(newState).toBe(state);
  });
});

describe('moveSnake', () => {
  it('should move snake head in current direction', () => {
    const state: SnakeState = {
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 },
      ],
      currentDirection: 'down',
      pendingDirection: null,
    };
    
    const newState = moveSnake(state);
    expect(newState.body[0]).toEqual({ x: 10, y: 11 });
  });

  it('should shift body segments forward', () => {
    const state: SnakeState = {
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 },
      ],
      currentDirection: 'down',
      pendingDirection: null,
    };
    
    const newState = moveSnake(state);
    expect(newState.body[1]).toEqual({ x: 10, y: 10 });
    expect(newState.body[2]).toEqual({ x: 10, y: 9 });
  });

  it('should maintain body length', () => {
    const state: SnakeState = {
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 },
      ],
      currentDirection: 'down',
      pendingDirection: null,
    };
    
    const newState = moveSnake(state);
    expect(newState.body.length).toBe(3);
  });

  it('should not modify pending direction', () => {
    const state: SnakeState = {
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 },
      ],
      currentDirection: 'down',
      pendingDirection: 'left',
    };
    
    const newState = moveSnake(state);
    expect(newState.pendingDirection).toBe('left');
  });

  it('should move snake left correctly', () => {
    const state: SnakeState = {
      body: [
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 12, y: 10 },
      ],
      currentDirection: 'left',
      pendingDirection: null,
    };
    
    const newState = moveSnake(state);
    expect(newState.body[0]).toEqual({ x: 9, y: 10 });
    expect(newState.body[1]).toEqual({ x: 10, y: 10 });
    expect(newState.body[2]).toEqual({ x: 11, y: 10 });
  });

  it('should move snake right correctly', () => {
    const state: SnakeState = {
      body: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ],
      currentDirection: 'right',
      pendingDirection: null,
    };
    
    const newState = moveSnake(state);
    expect(newState.body[0]).toEqual({ x: 11, y: 10 });
    expect(newState.body[1]).toEqual({ x: 10, y: 10 });
    expect(newState.body[2]).toEqual({ x: 9, y: 10 });
  });

  it('should move snake up correctly', () => {
    const state: SnakeState = {
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
      ],
      currentDirection: 'up',
      pendingDirection: null,
    };
    
    const newState = moveSnake(state);
    expect(newState.body[0]).toEqual({ x: 10, y: 9 });
    expect(newState.body[1]).toEqual({ x: 10, y: 10 });
    expect(newState.body[2]).toEqual({ x: 10, y: 11 });
  });
});