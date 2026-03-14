import { describe, expect, it } from 'vitest';
import { 
  TILE_COUNT_HORIZONTAL, 
  TILE_COUNT_VERTICAL, 
  TOTAL_TILE_COUNT,
  createTilePosition,
  isValidTilePosition
} from '../../src/grid/grid-constants';

describe('Tile Calculation', () => {
  describe('Grid Constants', () => {
    it('correctly defines grid dimensions', () => {
      expect(TILE_COUNT_HORIZONTAL).toBe(32);
      expect(TILE_COUNT_VERTICAL).toBe(32);
    });

    it('correctly calculates total tile count', () => {
      expect(TOTAL_TILE_COUNT).toBe(1024);
      expect(TOTAL_TILE_COUNT).toBe(TILE_COUNT_HORIZONTAL * TILE_COUNT_VERTICAL);
    });
  });

  describe('Tile Position Validation', () => {
    it('validates correct tile positions', () => {
      expect(isValidTilePosition(createTilePosition(0, 0))).toBe(true);
      expect(isValidTilePosition(createTilePosition(31, 31))).toBe(true);
      expect(isValidTilePosition(createTilePosition(15, 15))).toBe(true);
    });

    it('rejects invalid tile positions', () => {
      expect(isValidTilePosition(createTilePosition(-1, 0))).toBe(false);
      expect(isValidTilePosition(createTilePosition(0, -1))).toBe(false);
      expect(isValidTilePosition(createTilePosition(32, 0))).toBe(false);
      expect(isValidTilePosition(createTilePosition(0, 32))).toBe(false);
    });

    it('rejects non-integer tile positions', () => {
      expect(isValidTilePosition({ columnIndex: 1.5, rowIndex: 0 })).toBe(false);
      expect(isValidTilePosition({ columnIndex: 0, rowIndex: 1.5 })).toBe(false);
    });
  });
});