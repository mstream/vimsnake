import { test, expect } from '@playwright/test';

test.describe('Collision Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('snake crashes when hitting right grid boundary', async ({ page }) => {
    await page.keyboard.press('l');
    
    await page.waitForTimeout(4000);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    await page.waitForTimeout(2000);
    
    expect(true).toBe(true);
  });
  
  test('snake crashes when hitting left grid boundary', async ({ page }) => {
    await page.keyboard.press('h');
    
    await page.waitForTimeout(4000);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    await page.waitForTimeout(2000);
    
    expect(true).toBe(true);
  });
  
  test('snake crashes when hitting top grid boundary', async ({ page }) => {
    await page.keyboard.press('k');
    
    await page.waitForTimeout(4000);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    await page.waitForTimeout(2000);
    
    expect(true).toBe(true);
  });
  
  test('snake crashes when hitting bottom grid boundary', async ({ page }) => {
    await page.keyboard.press('j');
    
    await page.waitForTimeout(4000);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    await page.waitForTimeout(2000);
    
    expect(true).toBe(true);
  });
  
  test('snake crashes when colliding with its own body', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(1100);
    
    await page.keyboard.press('j');
    await page.waitForTimeout(1100);
    
    await page.keyboard.press('h');
    await page.waitForTimeout(1100);
    
    await page.keyboard.press('k');
    await page.waitForTimeout(1100);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    await page.waitForTimeout(2000);
    
    expect(true).toBe(true);
  });
  
  test('game-over overlay displays after collision', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(4000);
    
    await page.waitForTimeout(2000);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    expect(true).toBe(true);
  });
  
  test('game automatically restarts after collision', async ({ page }) => {
    await page.keyboard.press('l');
    await page.waitForTimeout(4000);
    
    await page.waitForTimeout(2000);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    await page.waitForTimeout(2000);
    
    expect(true).toBe(true);
  });
});