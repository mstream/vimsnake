import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/vimsnake/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    globals: true,
    environment: 'jsdom'
  }
});