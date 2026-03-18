import { describe, it, expect } from 'vitest';
import { getPositionsAdjacentTo, isPositionAdjacentToSnakeBody, getInvalidPositionsForFood } from '../../../src/food/food-adjacency';
import type { SnakeBody } from '../../../src/snake/snake-types';

describe('getPositionsAdjacentTo', () => {
  it('returns exactly 8 positions for center cell', () => {
    const position = { x: 5, y: 5 };
    const adjacent = getPositionsAdjacentTo(position);
    expect(adjacent.length).toBe(8);
  });

  it('returns 3 positions for top-left corner', () => {
    const position = { x: 0, y: 0 };
    const adjacent = getPositionsAdjacentTo(position);
    expect(adjacent.length).toBe(3);
    expect(adjacent).toContainEqual({ x: 0, y: 1 });
    expect(adjacent).toContainEqual({ x: 1, y: 0 });
    expect(adjacent).toContainEqual({ x: 1, y: 1 });
  });

  it('returns 3 positions for top-right corner', () => {
    const position = { x: 31, y: 0 };
    const adjacent = getPositionsAdjacentTo(position);
    expect(adjacent.length).toBe(3);
    expect(adjacent).toContainEqual({ x: 30, y: 0 });
    expect(adjacent).toContainEqual({ x: 30, y: 1 });
    expect(adjacent).toContainEqual({ x: 31, y: 1 });
  });

  it('returns 3 positions for bottom-left corner', () => {
    const position = { x: 0, y: 31 };
    const adjacent = getPositionsAdjacentTo(position);
    expect(adjacent.length).toBe(3);
    expect(adjacent).toContainEqual({ x: 0, y: 30 });
    expect(adjacent).toContainEqual({ x: 1, y: 30 });
    expect(adjacent).toContainEqual({ x: 1, y: 31 });
  });

  it('returns 3 positions for bottom-right corner', () => {
    const position = { x: 31, y: 31 };
    const adjacent = getPositionsAdjacentTo(position);
    expect(adjacent.length).toBe(3);
    expect(adjacent).toContainEqual({ x: 30, y: 30 });
    expect(adjacent).toContainEqual({ x: 30, y: 31 });
    expect(adjacent).toContainEqual({ x: 31, y: 30 });
  });

  it('returns 5 positions for edge cell', () => {
    const position = { x: 0, y: 5 };
    const adjacent = getPositionsAdjacentTo(position);
    expect(adjacent.length).toBe(5);
  });

  it('includes all diagonal directions', () => {
    const position = { x: 5, y: 5 };
    const adjacent = getPositionsAdjacentTo(position);
    expect(adjacent).toContainEqual({ x: 4, y: 4 });
    expect(adjacent).toContainEqual({ x: 6, y: 6 });
    expect(adjacent).toContainEqual({ x: 4, y: 6 });
    expect(adjacent).toContainEqual({ x: 6, y: 4 });
  });
});

describe('isPositionAdjacentToSnakeBody', () => {
  it('returns false for position away from snake', () => {
    const snakeBody: SnakeBody = [{ x: 10, y: 10 }];
    const position = { x: 5, y: 5 };
    expect(isPositionAdjacentToSnakeBody(position, snakeBody)).toBe(false);
  });

  it('returns true for position adjacent to snake head', () => {
    const snakeBody: SnakeBody = [{ x: 10, y: 10 }];
    const position = { x: 9, y: 9 };
    expect(isPositionAdjacentToSnakeBody(position, snakeBody)).toBe(true);
  });

  it('returns true for position diagonally adjacent to snake', () => {
    const snakeBody: SnakeBody = [{ x: 10, y: 10 }];
    const position = { x: 11, y: 11 };
    expect(isPositionAdjacentToSnakeBody(position, snakeBody)).toBe(true);
  });

  it('returns true for position adjacent to middle segment', () => {
    const snakeBody: SnakeBody = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    const position = { x: 11, y: 11 };
    expect(isPositionAdjacentToSnakeBody(position, snakeBody)).toBe(true);
  });

  it('returns false for position on snake body', () => {
    const snakeBody: SnakeBody = [{ x: 10, y: 10 }];
    const position = { x: 10, y: 10 };
    expect(isPositionAdjacentToSnakeBody(position, snakeBody)).toBe(false);
  });
});

describe('getInvalidPositionsForFood', () => {
  it('includes snake body positions', () => {
    const snakeBody: SnakeBody = [{ x: 10, y: 10 }];
    const invalidPositions = getInvalidPositionsForFood(snakeBody);
    expect(invalidPositions.has('10,10')).toBe(true);
  });

  it('includes adjacent positions for single segment snake', () => {
    const snakeBody: SnakeBody = [{ x: 10, y: 10 }];
    const invalidPositions = getInvalidPositionsForFood(snakeBody);
    expect(invalidPositions.size).toBe(9);
  });

  it('includes all segments for multi-segment snake', () => {
    const snakeBody: SnakeBody = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    const invalidPositions = getInvalidPositionsForFood(snakeBody);
    expect(invalidPositions.has('10,10')).toBe(true);
    expect(invalidPositions.has('10,11')).toBe(true);
    expect(invalidPositions.has('10,12')).toBe(true);
  });

  it('handles adjacent positions for multi-segment snake', () => {
    const snakeBody: SnakeBody = [
      { x: 5, y: 5 },
      { x: 5, y: 6 }
    ];
    const invalidPositions = getInvalidPositionsForFood(snakeBody);
    expect(invalidPositions.has('5,5')).toBe(true);
    expect(invalidPositions.has('5,6')).toBe(true);
    expect(invalidPositions.has('4,4')).toBe(true);
    expect(invalidPositions.has('6,5')).toBe(true);
  });
});