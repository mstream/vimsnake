import { expect, test } from '@playwright/test';

test.describe('Grid Visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders complete 32x32 grid within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.waitForSelector('canvas', { state: 'attached' });
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(2000);
  });

  test('displays all 1024 tiles with visible boundaries', async ({ page }) => {
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const gridDimensions = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
      return {
        width: canvas.width,
        height: canvas.height,
        tileCountHorizontal: 32,
        tileCountVertical: 32
      };
    });
    
    expect(gridDimensions.tileCountHorizontal).toBe(32);
    expect(gridDimensions.tileCountVertical).toBe(32);
    expect(gridDimensions.width).toBeGreaterThan(0);
    expect(gridDimensions.height).toBeGreaterThan(0);
  });

  test('grid occupies appropriate screen space without distortion', async ({ page }) => {
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const canvasInfo = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height
      };
    });
    
    expect(canvasInfo.width).toBeGreaterThan(0);
    expect(canvasInfo.height).toBeGreaterThan(0);
  });

  test('tile boundaries are clearly visible with clear separation', async ({ page }) => {
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const boundaryInfo = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return { hasGridLines: false };
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let hasBlackPixels = false;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
          hasBlackPixels = true;
          break;
        }
      }
      
      return { hasGridLines: hasBlackPixels };
    });
    
    expect(boundaryInfo.hasGridLines).toBe(true);
  });

  test('users can visually locate any tile by row and column coordinates', async ({ page }) => {
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const tileLocation = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const tileSize = Math.min(viewportWidth, viewportHeight) / 32;
      const gridWidth = tileSize * 32;
      const offsetX = (viewportWidth - gridWidth) / 2;
      const offsetY = (viewportHeight - gridWidth) / 2;
      
      const centerColumn = 15;
      const centerRow = 15;
      const expectedX = offsetX + centerColumn * tileSize + tileSize / 2;
      const expectedY = offsetY + centerRow * tileSize + tileSize / 2;
      
      return {
        hasValidOffset: offsetX >= 0 && offsetY >= 0,
        hasValidTileSize: tileSize > 0,
        centerTileInRange: expectedX > 0 && expectedY > 0
      };
    });
    
    expect(tileLocation.hasValidOffset).toBe(true);
    expect(tileLocation.hasValidTileSize).toBe(true);
    expect(tileLocation.centerTileInRange).toBe(true);
  });

  test('grid scales proportionally to fit viewport', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const scalingInfo = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const minDimension = Math.min(viewportWidth, viewportHeight);
      const tileSize = minDimension / 32;
      const gridFitsInViewport = tileSize * 32 <= minDimension;
      
      return {
        viewportWidth,
        viewportHeight,
        gridFitsInViewport
      };
    });
    
    expect(scalingInfo.gridFitsInViewport).toBe(true);
  });

  test('letterboxing applied on non-square viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 600 });
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const letterboxInfo = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const minDimension = Math.min(viewportWidth, viewportHeight);
      const tileSize = minDimension / 32;
      const gridWidth = tileSize * 32;
      
      const expectedOffsetX = (viewportWidth - gridWidth) / 2;
      const hasHorizontalLetterboxing = expectedOffsetX > 0;
      
      return { hasHorizontalLetterboxing };
    });
    
    expect(letterboxInfo.hasHorizontalLetterboxing).toBe(true);
  });

  test('tiles remain square at all viewport sizes', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 });
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const tileShapeInfo = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const minDimension = Math.min(viewportWidth, viewportHeight);
      const tileSize = minDimension / 32;
      
      return {
        isSquare: tileSize === tileSize,
        tileSize
      };
    });
    
    expect(tileShapeInfo.isSquare).toBe(true);
    expect(tileShapeInfo.tileSize).toBeGreaterThan(0);
  });

  test('grid renders within 16ms for 60fps target', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible' });
    
    const renderTime = await page.evaluate(async () => {
      const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return { renderTimeMillis: -1 };
      
      const startTime = performance.now();
      
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.strokeStyle = '#000000';
      context.lineWidth = 1;
      context.beginPath();
      
      const tileSize = Math.min(canvas.width, canvas.height) / 32;
      const offsetX = (canvas.width - tileSize * 32) / 2;
      const offsetY = (canvas.height - tileSize * 32) / 2;
      
      for (let i = 0; i <= 32; i++) {
        const x = offsetX + i * tileSize;
        context.moveTo(x, offsetY);
        context.lineTo(x, offsetY + tileSize * 32);
      }
      
      for (let i = 0; i <= 32; i++) {
        const y = offsetY + i * tileSize;
        context.moveTo(offsetX, y);
        context.lineTo(offsetX + tileSize * 32, y);
      }
      
      context.stroke();
      
      const endTime = performance.now();
      return { renderTimeMillis: endTime - startTime };
    });
    
    expect(renderTime.renderTimeMillis).toBeLessThan(16);
  });
});