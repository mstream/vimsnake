import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  initializeKeyboardInput,
  cleanupKeyboardInput,
  getCurrentSnakeState,
  updateSnakeState,
} from '../../../src/snake/keyboard-input';
import type { SnakeState } from '../../../src/snake/snake-types';

describe('keyboard-input', () => {
  beforeEach(() => {
    vi.spyOn(document, 'addEventListener');
    vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    cleanupKeyboardInput();
  });

  describe('initializeKeyboardInput', () => {
    it('should add keydown event listener', () => {
      const state: SnakeState = {
        body: [{ x: 10, y: 10 }],
        currentDirection: 'down',
        pendingDirection: null,
      };
      
      initializeKeyboardInput(state);
      
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should store initial snake state', () => {
      const state: SnakeState = {
        body: [{ x: 10, y: 10 }],
        currentDirection: 'down',
        pendingDirection: null,
      };
      
      initializeKeyboardInput(state);
      
      const currentState = getCurrentSnakeState();
      expect(currentState).toEqual(state);
    });
  });

  describe('cleanupKeyboardInput', () => {
    it('should remove keydown event listener', () => {
      const state: SnakeState = {
        body: [{ x: 10, y: 10 }],
        currentDirection: 'down',
        pendingDirection: null,
      };
      
      initializeKeyboardInput(state);
      cleanupKeyboardInput();
      
      expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should clear stored snake state', () => {
      const state: SnakeState = {
        body: [{ x: 10, y: 10 }],
        currentDirection: 'down',
        pendingDirection: null,
      };
      
      initializeKeyboardInput(state);
      cleanupKeyboardInput();
      
      const currentState = getCurrentSnakeState();
      expect(currentState).toBeNull();
    });
  });

  describe('updateSnakeState', () => {
    it('should update the stored snake state', () => {
      const initialState: SnakeState = {
        body: [{ x: 10, y: 10 }],
        currentDirection: 'down',
        pendingDirection: null,
      };
      
      initializeKeyboardInput(initialState);
      
      const newState: SnakeState = {
        body: [{ x: 10, y: 11 }],
        currentDirection: 'down',
        pendingDirection: null,
      };
      
      updateSnakeState(newState);
      
      const currentState = getCurrentSnakeState();
      expect(currentState).toEqual(newState);
    });
  });

  describe('getCurrentSnakeState', () => {
    it('should return null before initialization', () => {
      const currentState = getCurrentSnakeState();
      expect(currentState).toBeNull();
    });

    it('should return current state after initialization', () => {
      const state: SnakeState = {
        body: [{ x: 10, y: 10 }],
        currentDirection: 'down',
        pendingDirection: null,
      };
      
      initializeKeyboardInput(state);
      
      const currentState = getCurrentSnakeState();
      expect(currentState).toEqual(state);
    });
  });
});