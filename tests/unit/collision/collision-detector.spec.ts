import { describe, test, expect } from 'vitest';
import { getGridBounds, isPositionWithinBounds, hasBoundaryCollision, hasSelfCollision, detectCollision } from '../../../src/collision/collision-detector';
import type { SnakeBody } from '../../../src/snake/snake-types';

describe('collision detector', () => {
  describe('getGridBounds', () => {
    test('returns correct grid bounds for 32x32 grid', () => {
      const bounds = getGridBounds();
      expect(bounds.minimumX).toBe(0);
      expect(bounds.maximumX).toBe(31);
      expect(bounds.minimumY).toBe(0);
      expect(bounds.maximumY).toBe(31);
    });
  });
  
  describe('isPositionWithinBounds', () => {
    test('returns true for position inside grid', () => {
      const bounds = getGridBounds();
      const position = { x: 10, y: 15 };
      expect(isPositionWithinBounds(position, bounds)).toBe(true);
    });
    
    test('returns true for position at edge', () => {
      const bounds = getGridBounds();
      const position = { x: 31, y: 31 };
      expect(isPositionWithinBounds(position, bounds)).toBe(true);
    });
    
    test('returns true for position at origin', () => {
      const bounds = getGridBounds();
      const position = { x: 0, y: 0 };
      expect(isPositionWithinBounds(position, bounds)).toBe(true);
    });
    
    test('returns false for position outside grid positive x', () => {
      const bounds = getGridBounds();
      const position = { x: 32, y: 15 };
      expect(isPositionWithinBounds(position, bounds)).toBe(false);
    });
    
    test('returns false for position outside grid negative x', () => {
      const bounds = getGridBounds();
      const position = { x: -1, y: 15 };
      expect(isPositionWithinBounds(position, bounds)).toBe(false);
    });
    
    test('returns false for position outside grid positive y', () => {
      const bounds = getGridBounds();
      const position = { x: 10, y: 32 };
      expect(isPositionWithinBounds(position, bounds)).toBe(false);
    });
    
    test('returns false for position outside grid negative y', () => {
      const bounds = getGridBounds();
      const position = { x: 10, y: -1 };
      expect(isPositionWithinBounds(position, bounds)).toBe(false);
    });
  });
  
  describe('hasBoundaryCollision', () => {
    test('detects collision at right boundary', () => {
      const bounds = getGridBounds();
      const head = { x: 32, y: 15 };
      expect(hasBoundaryCollision(head, bounds)).toBe(true);
    });
    
    test('detects collision at left boundary', () => {
      const bounds = getGridBounds();
      const head = { x: -1, y: 15 };
      expect(hasBoundaryCollision(head, bounds)).toBe(true);
    });
    
    test('detects collision at top boundary', () => {
      const bounds = getGridBounds();
      const head = { x: 10, y: -1 };
      expect(hasBoundaryCollision(head, bounds)).toBe(true);
    });
    
    test('detects collision at bottom boundary', () => {
      const bounds = getGridBounds();
      const head = { x: 10, y: 32 };
      expect(hasBoundaryCollision(head, bounds)).toBe(true);
    });
    
    test('returns false for position inside grid', () => {
      const bounds = getGridBounds();
      const head = { x: 15, y: 15 };
      expect(hasBoundaryCollision(head, bounds)).toBe(false);
    });
    
    test('returns false for position at exact boundary', () => {
      const bounds = getGridBounds();
      const head = { x: 31, y: 31 };
      expect(hasBoundaryCollision(head, bounds)).toBe(false);
    });
  });
  
  describe('hasSelfCollision', () => {
    test('returns false when no collision', () => {
      const head = { x: 5, y: 5 };
      const body: SnakeBody = [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 }
      ];
      expect(hasSelfCollision(head, body)).toBe(false);
    });
    
    test('returns false for snake at minimum length 3', () => {
      const head = { x: 5, y: 5 };
      const body: SnakeBody = [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 }
      ];
      expect(hasSelfCollision(head, body)).toBe(false);
    });
    
    test('returns true when head collides with body segment', () => {
      const head = { x: 5, y: 4 };
      const body: SnakeBody = [
        { x: 5, y: 4 },
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 }
      ];
      expect(hasSelfCollision(head, body)).toBe(true);
    });
    
    test('returns true when head collides with middle segment', () => {
      const head = { x: 5, y: 3 };
      const body: SnakeBody = [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 },
        { x: 6, y: 3 }
      ];
      expect(hasSelfCollision(head, body)).toBe(true);
    });
    
    test('returns true when head collides with tail segment', () => {
      const head = { x: 6, y: 3 };
      const body: SnakeBody = [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 },
        { x: 6, y: 3 }
      ];
      expect(hasSelfCollision(head, body)).toBe(true);
    });
  });
  
  describe('detectCollision', () => {
    test('returns boundary collision when head outside grid', () => {
      const body: SnakeBody = [
        { x: 32, y: 15 },
        { x: 31, y: 15 },
        { x: 30, y: 15 }
      ];
      const result = detectCollision(body);
      expect(result.hasCollision).toBe(true);
      expect(result.collisionType).toBe('boundary');
    });
    
    test('returns self collision when head overlaps body', () => {
      const body: SnakeBody = [
        { x: 5, y: 4 },
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 }
      ];
      const result = detectCollision(body);
      expect(result.hasCollision).toBe(true);
      expect(result.collisionType).toBe('self');
    });
    
    test('returns boundary collision (not self) when both occur', () => {
      const body: SnakeBody = [
        { x: 32, y: 15 },
        { x: 32, y: 15 },
        { x: 31, y: 15 }
      ];
      const result = detectCollision(body);
      expect(result.hasCollision).toBe(true);
      expect(result.collisionType).toBe('boundary');
    });
    
    test('returns no collision for valid position', () => {
      const body: SnakeBody = [
        { x: 15, y: 15 },
        { x: 15, y: 14 },
        { x: 15, y: 13 }
      ];
      const result = detectCollision(body);
      expect(result.hasCollision).toBe(false);
      expect(result.collisionType).toBeNull();
    });
  });
});