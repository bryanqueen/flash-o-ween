import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    testTimeout: 30000, // 30 seconds for property-based tests with Canvas/ImageData
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
