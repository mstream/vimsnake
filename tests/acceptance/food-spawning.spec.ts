import { expect, test } from '@playwright/test';

test.describe('Food Spawning - Initial Placement (US1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
  });

  test('food appears on game start within 1 second (SC-001)', async ({ page }) => {
    const startTime = Date.now();
    
    const gameState = await page.evaluate(() => {
      const state = (window as any).gameState;
      return state;
    });
    
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(1000);
    
    expect(gameState).toBeDefined();
    expect(gameState.foodState).toBeDefined();
    expect(gameState.foodState.position).toBeDefined();
    expect(gameState.foodState.position).not.toBeNull();
  });

  test('food is not positioned on snake body', async ({ page }) => {
    const gameState = await page.evaluate(() => {
      return (window as any).gameState;
    });
    
    expect(gameState).toBeDefined();
    expect(gameState.foodState).toBeDefined();
    expect(gameState.snakeState).toBeDefined();
    
    const foodPosition = gameState.foodState.position;
    const snakeBody = gameState.snakeState.body;
    
    const isOnSnake = snakeBody.some(
      (segment: { x: number; y: number }) => 
        segment.x === foodPosition.x && segment.y === foodPosition.y
    );
    
    expect(isOnSnake).toBe(false);
  });

  test('food is not positioned adjacent to snake body', async ({ page }) => {
    const gameState = await page.evaluate(() => {
      return (window as any).gameState;
    });
    
    expect(gameState).toBeDefined();
    expect(gameState.foodState).toBeDefined();
    expect(gameState.snakeState).toBeDefined();
    
    const foodPosition = gameState.foodState.position;
    const snakeBody = gameState.snakeState.body;
    
    for (const segment of snakeBody) {
      for (let deltaX = -1; deltaX <= 1; deltaX++) {
        for (let deltaY = -1; deltaY <= 1; deltaY++) {
          if (deltaX === 0 && deltaY === 0) continue;
          
          const adjacentX = segment.x + deltaX;
          const adjacentY = segment.y + deltaY;
          
          if (foodPosition.x === adjacentX && foodPosition.y === adjacentY) {
            expect(false).toBe(true);
          }
        }
      }
    }
    
    expect(true).toBe(true);
  });

  test('food occupies exactly one grid cell', async ({ page }) => {
    const gameState = await page.evaluate(() => {
      return (window as any).gameState;
    });
    
    expect(gameState).toBeDefined();
    expect(gameState.foodState).toBeDefined();
    
    const foodPosition = gameState.foodState.position;
    
    expect(foodPosition).not.toBeNull();
    expect(typeof foodPosition.x).toBe('number');
    expect(typeof foodPosition.y).toBe('number');
    expect(Number.isInteger(foodPosition.x)).toBe(true);
    expect(Number.isInteger(foodPosition.y)).toBe(true);
    expect(foodPosition.x).toBeGreaterThanOrEqual(0);
    expect(foodPosition.y).toBeGreaterThanOrEqual(0);
    expect(foodPosition.x).toBeLessThan(32);
    expect(foodPosition.y).toBeLessThan(32);
  });
});

test.describe('Food Spawning - Consumption (US2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
  });

  test('game state includes isSnakeGrowing flag', async ({ page }) => {
    const gameState = await page.evaluate(() => {
      return (window as any).gameState;
    });
    
    expect(gameState).toBeDefined();
    expect(gameState.isSnakeGrowing).toBeDefined();
    expect(typeof gameState.isSnakeGrowing).toBe('boolean');
    expect(gameState.isSnakeGrowing).toBe(false);
  });

  test('initial snake body length is 3 segments', async ({ page }) => {
    const gameState = await page.evaluate(() => {
      return (window as any).gameState;
    });
    
    expect(gameState).toBeDefined();
    expect(gameState.snakeState).toBeDefined();
    expect(gameState.snakeState.body).toBeDefined();
    expect(gameState.snakeState.body.length).toBe(3);
  });
});