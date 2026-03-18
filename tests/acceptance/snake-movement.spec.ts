import { expect, test } from '@playwright/test';

test.describe('Snake Movement - User Story 1: Basic Continuous Movement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    await page.waitForTimeout(500);
  });

  test('snake appears on grid at center position', async ({ page }) => {
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return { hasSnake: false };
      
      const state = getSnakeState();
      if (!state) return { hasSnake: false };
      
      return {
        hasSnake: state.body && state.body.length > 0,
        headPosition: state.body[0],
        length: state.body.length
      };
    });
    
    expect(snakeState.hasSnake).toBe(true);
    expect(snakeState.length).toBe(3);
    expect(snakeState.headPosition.x).toBe(16);
    expect(snakeState.headPosition.y).toBe(16);
  });

  test('snake has 3 cells arranged vertically with head at center', async ({ page }) => {
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return null;
      
      const state = getSnakeState();
      if (!state) return null;
      
      return {
        body: state.body,
        direction: state.currentDirection
      };
    });
    
    expect(snakeState).not.toBeNull();
    if (!snakeState) return;
    
    expect(snakeState.body.length).toBe(3);
    expect(snakeState.body[0]).toEqual({ x: 16, y: 16 });
    expect(snakeState.body[1]).toEqual({ x: 16, y: 15 });
    expect(snakeState.body[2]).toEqual({ x: 16, y: 14 });
    expect(snakeState.direction).toBe('down');
  });

  test('snake moves downward automatically at 1 cell per second', async ({ page }) => {
    const initialPosition = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return null;
      const state = getSnakeState();
      return state ? state.body[0] : null;
    });
    
    expect(initialPosition).not.toBeNull();
    expect(initialPosition.y).toBe(16);
    
    await page.waitForTimeout(1100);
    
    const newPosition = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return null;
      const state = getSnakeState();
      return state ? state.body[0] : null;
    });
    
    expect(newPosition).not.toBeNull();
    expect(newPosition.y).toBe(initialPosition.y + 1);
    expect(newPosition.x).toBe(initialPosition.x);
  });

  test('snake continues moving in initial direction without input', async ({ page }) => {
    const positions: Array<{x: number, y: number}> = [];
    
    for (let i = 0; i < 4; i++) {
      const pos = await page.evaluate(() => {
        const getSnakeState = (window as any).__snakeState__;
        if (!getSnakeState) return null;
        const state = getSnakeState();
        return state ? { x: state.body[0].x, y: state.body[0].y } : null;
      });
      if (pos) positions.push(pos);
      await page.waitForTimeout(1000);
    }
    
    expect(positions.length).toBe(4);
    expect(positions[0].x).toBe(16);
    expect(positions[0].y).toBe(16);
    expect(positions[1].y).toBe(17);
    expect(positions[2].y).toBe(18);
    expect(positions[3].y).toBe(19);
    expect(positions[1].x).toBe(16);
    expect(positions[2].x).toBe(16);
    expect(positions[3].x).toBe(16);
  });
});

test.describe('Snake Movement - User Story 2: Direction Change with VIM Keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    await page.waitForTimeout(500);
  });

  test('pressing h turns snake left - snake moves left after tick', async ({ page }) => {
    await page.keyboard.press('h');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return null;
      const state = getSnakeState();
      return state ? { body: state.body, direction: state.currentDirection } : null;
    });
    
    expect(snakeState).not.toBeNull();
    if (!snakeState) return;
    
    expect(snakeState.direction).toBe('left');
    expect(snakeState.body[0].x).toBe(15);
    expect(snakeState.body[0].y).toBe(16);
  });

  test('pressing j turns snake down - snake moves down after tick', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    await page.keyboard.press('j');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return null;
      const state = getSnakeState();
      return state ? { body: state.body, direction: state.currentDirection } : null;
    });
    
    expect(snakeState).not.toBeNull();
    if (!snakeState) return;
    
    expect(snakeState.direction).toBe('down');
    expect(snakeState.body[0].y).toBeGreaterThan(16);
  });

  test('pressing k turns snake up - snake moves up after tick', async ({ page }) => {
    await page.keyboard.press('l');
    await page.keyboard.press('k');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return null;
      const state = getSnakeState();
      return state ? { body: state.body, direction: state.currentDirection } : null;
    });
    
    expect(snakeState).not.toBeNull();
    if (!snakeState) return;
    
    expect(snakeState.direction).toBe('up');
    expect(snakeState.body[0].y).toBe(15);
    expect(snakeState.body[0].x).toBe(16);
  });

  test('pressing l turns snake right - snake moves right after tick', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      if (!getSnakeState) return null;
      const state = getSnakeState();
      return state ? { body: state.body, direction: state.currentDirection } : null;
    });
    
    expect(snakeState).not.toBeNull();
    if (!snakeState) return;
    
    expect(snakeState.direction).toBe('right');
    expect(snakeState.body[0].x).toBe(17);
    expect(snakeState.body[0].y).toBe(16);
  });

  test('direction change persists across multiple ticks', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    const afterFirstTick = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState().body[0] : null;
    });
    
    await page.waitForTimeout(1000);
    
    const afterSecondTick = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState().body[0] : null;
    });
    
    expect(afterSecondTick.x).toBe(afterFirstTick.x + 1);
    expect(afterSecondTick.y).toBe(afterFirstTick.y);
  });
});

test.describe('Snake Movement - User Story 3: Directional Constraint', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    await page.waitForTimeout(500);
  });

  test('pressing up (k) while moving down is ignored - snake continues down', async ({ page }) => {
    await page.keyboard.press('k');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(snakeState.currentDirection).toBe('down');
    expect(snakeState.body[0].y).toBe(17);
    expect(snakeState.body[0].x).toBe(16);
  });

  test('pressing down (j) while moving up is ignored - snake continues up', async ({ page }) => {
    await page.keyboard.press('l');
    await page.keyboard.press('k');
    await page.waitForTimeout(1100);
    
    const afterTurnUp = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState().body[0] : null;
    });
    
    await page.keyboard.press('j');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(snakeState.currentDirection).toBe('up');
    expect(snakeState.body[0].y).toBeLessThan(afterTurnUp.y);
  });

  test('pressing right (l) while moving left is ignored - snake continues left', async ({ page }) => {
    await page.keyboard.press('h');
    await page.waitForTimeout(1100);
    
    const afterTurnLeft = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState().body[0] : null;
    });
    
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(snakeState.currentDirection).toBe('left');
    expect(snakeState.body[0].x).toBeLessThan(afterTurnLeft.x);
  });

  test('pressing left (h) while moving right is ignored - snake continues right', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    const afterTurnRight = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState().body[0] : null;
    });
    
    await page.keyboard.press('h');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(snakeState.currentDirection).toBe('right');
    expect(snakeState.body[0].x).toBeGreaterThan(afterTurnRight.x);
  });
});

test.describe('Snake Movement - User Story 4: Single Direction Queue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    await page.waitForTimeout(500);
  });

  test('only last valid key press in same tick applies - h then j results in down', async ({ page }) => {
    await page.keyboard.press('h');
    await page.keyboard.press('j');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(snakeState.currentDirection).toBe('down');
    expect(snakeState.body[0].y).toBe(17);
    expect(snakeState.body[0].x).toBe(16);
  });

  test('pressing same direction twice maintains direction', async ({ page }) => {
    await page.keyboard.press('l');
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(snakeState.currentDirection).toBe('right');
    expect(snakeState.body[0].x).toBe(17);
    expect(snakeState.body[0].y).toBe(16);
  });

  test('valid turn sequence: down -> queue right -> queue up results in turning up after right', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    const afterFirstTick = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(afterFirstTick.currentDirection).toBe('right');
    expect(afterFirstTick.body[0].x).toBe(17);
    expect(afterFirstTick.body[0].y).toBe(16);
    
    await page.keyboard.press('k');
    await page.waitForTimeout(1000);
    
    const afterSecondTick = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(afterSecondTick.currentDirection).toBe('up');
    expect(afterSecondTick.body[0].y).toBeLessThan(afterFirstTick.body[0].y);
    expect(afterSecondTick.body[0].x).toBe(17);
  });

  test('reversal blocked even with pending direction: down -> queue right -> left is blocked', async ({ page }) => {
    await page.keyboard.press('l');
    await page.keyboard.press('h');
    await page.waitForTimeout(1100);
    
    const snakeState = await page.evaluate(() => {
      const getSnakeState = (window as any).__snakeState__;
      return getSnakeState ? getSnakeState() : null;
    });
    
    expect(snakeState.currentDirection).toBe('right');
    expect(snakeState.body[0].x).toBe(17);
    expect(snakeState.body[0].y).toBe(16);
  });
});